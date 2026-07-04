import { SpaceContext } from "@cocrepo/context";
import type {
	GrantIdpAccountAccessInput,
	IdpAccountListInput,
} from "@cocrepo/input";
import {
	AuthAuditLogsRepository,
	RolesRepository,
	SpacesRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class IdpAccountAggregate {
	private readonly logger = new Logger(IdpAccountAggregate.name);

	constructor(
		private readonly spaceContext: SpaceContext,
		private readonly usersRepository: UsersRepository,
		private readonly spacesRepository: SpacesRepository,
		private readonly rolesRepository: RolesRepository,
		private readonly tenantsRepository: TenantsRepository,
		private readonly auditLogsRepository: AuthAuditLogsRepository,
	) {}

	async getMany(input: IdpAccountListInput) {
		this.logger.debug("IDP 계정 목록 조회");

		return this.usersRepository.findManyIdpAccounts({
			input,
			spaceIds: this.spaceContext.spaceIds,
		});
	}

	async getById(userId: string) {
		this.logger.debug(`IDP 계정 상세 조회: ${userId.slice(-8)}`);

		const user = await this.findAccountInScope(userId);
		const accessGrants = await this.getAccessGrants(userId);

		return { ...user, accessGrants };
	}

	async getRecentAuditLogs(userId: string, limit = 5) {
		return this.auditLogsRepository.findByUserId(userId, limit);
	}

	async getAccessGrantFormBootstrap(userId: string) {
		this.logger.debug(`계정 접근 권한 부여 폼 조회: ${userId.slice(-8)}`);

		await this.findAccountInScope(userId);

		const [spaceResult, roles] = await Promise.all([
			this.spacesRepository.findManyWithGround({
				spaceIds: this.spaceContext.spaceIds,
			}),
			this.rolesRepository.findMany({
				where: { removedAt: null },
				orderBy: [{ createdAt: "asc" }],
			}),
		]);
		const [spaces] = spaceResult;

		const spaceOptions = spaces.map((space) => {
			const primaryGround = space.company?.ground ?? space.ground;
			return {
				value: space.id,
				label: primaryGround?.name ?? space.id,
				description: primaryGround?.label ?? primaryGround?.address ?? undefined,
			};
		});
		const roleOptions = roles.map((role) => ({
			value: role.id,
			label: role.displayName ?? role.name,
			description: role.description ?? role.name,
		}));

		return {
			mode: "CREATE",
			defaultObject: {
				spaceId: spaceOptions[0]?.value ?? "",
				roleId: roleOptions[0]?.value ?? "",
			},
			options: {
				spaceId: spaceOptions,
				roleId: roleOptions,
			},
			ui: {
				readOnlyPaths: [],
				hiddenPaths: [],
				disabledPaths: [],
			},
			fieldMeta: {
				spaceId: { label: "Space" },
				roleId: { label: "Role" },
			},
		};
	}

	@Transactional()
	async grantAccess(userId: string, input: GrantIdpAccountAccessInput) {
		this.logger.debug(
			`계정 접근 권한 부여: user=${userId.slice(-8)}, space=${input.spaceId.slice(-8)}, role=${input.roleId.slice(-8)}`,
		);

		await this.findAccountInScope(userId);

		const [space, roles] = await Promise.all([
			this.spacesRepository.findById(input.spaceId),
			this.rolesRepository.findMany({
				where: { id: input.roleId, removedAt: null },
				orderBy: [{ createdAt: "asc" }],
			}),
		]);

		if (
			!space ||
			space.removedAt !== null ||
			this.isSpaceOutOfScope(input.spaceId)
		) {
			throw new NotFoundException("권한을 부여할 Space를 찾을 수 없습니다");
		}

		const [role] = roles;
		if (!role) {
			throw new NotFoundException("권한을 부여할 Role을 찾을 수 없습니다");
		}

		await this.tenantsRepository.upsertByUserIdAndSpaceId({
			userId,
			spaceId: input.spaceId,
			roleId: input.roleId,
		});

		return this.getById(userId);
	}

	@Transactional()
	async toggleActive(userId: string) {
		this.logger.debug(`계정 활성/비활성 토글: ${userId.slice(-8)}`);

		const user = await this.findAccountInScope(userId);
		const updated = await this.usersRepository.updateIdpAccountById({
			userId,
			data: { isActive: !user.isActive },
			spaceIds: this.spaceContext.spaceIds,
		});

		if (!updated) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		return updated;
	}

	@Transactional()
	async resetFailedAttempts(userId: string): Promise<void> {
		this.logger.debug(`실패 횟수 초기화: ${userId.slice(-8)}`);

		const updated = await this.usersRepository.updateIdpAccountById({
			userId,
			data: {
				failedLoginAttempts: 0,
				lockedUntil: null,
				isPermanentlyLocked: false,
			},
			spaceIds: this.spaceContext.spaceIds,
		});

		if (!updated) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}
	}

	private async findAccountInScope(userId: string) {
		const user = await this.usersRepository.findIdpAccountById({
			userId,
			spaceIds: this.spaceContext.spaceIds,
		});

		if (!user) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		return user;
	}

	private async getAccessGrants(userId: string) {
		const tenants = await this.tenantsRepository.findManyWithSpaceAndRole({
			where: {
				userId,
				removedAt: null,
				...(this.spaceContext.spaceIds
					? { spaceId: { in: this.spaceContext.spaceIds } }
					: {}),
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return tenants.map((tenant) => {
			const primaryGround = tenant.space.company?.ground;
			return {
				tenantId: tenant.id,
				spaceId: tenant.spaceId,
				spaceName: primaryGround?.name ?? tenant.spaceId,
				spaceLabel: primaryGround?.label ?? null,
				roleId: tenant.roleId,
				roleName: tenant.role.name,
				roleDisplayName: tenant.role.displayName ?? null,
				grantedAt: tenant.createdAt,
				updatedAt: tenant.updatedAt ?? null,
			};
		});
	}

	private isSpaceOutOfScope(spaceId: string): boolean {
		const spaceIds = this.spaceContext.spaceIds;
		return spaceIds !== undefined && !spaceIds.includes(spaceId);
	}
}
