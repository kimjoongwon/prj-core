import { SpaceContext } from "@cocrepo/context";
import type {
	GrantIdpAccountAccessDto,
	QueryIdpAccountDto,
} from "@cocrepo/dto";
import type { Prisma, PrismaClient } from "@cocrepo/prisma";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { ACCOUNT_SELECT } from "./account-select";
import type { IdpAccountInfo } from "./idp-account.info";
import type { IdpAccountAccessGrantInfo } from "./idp-account-access-grant.info";
import type { IdpAccountAccessGrantFormBootstrap } from "./idp-account-access-grant-form.bootstrap";
import type { IdpAccountDetailInfo } from "./idp-account-detail.info";

@Injectable()
export class IdpAccountAggregate {
	private readonly logger = new Logger(IdpAccountAggregate.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
		private readonly spaceContext: SpaceContext,
		private readonly auditLogsRepository: AuthAuditLogsRepository,
	) {}

	async getMany(query: QueryIdpAccountDto): Promise<{
		data: IdpAccountInfo[];
		totalCount: number;
	}> {
		this.logger.debug("IDP 계정 목록 조회");

		const where = this.applySpaceScope(
			query.toPrismaWhere({ removedAt: null }),
		);
		const orderBy = query.toPrismaOrderBy();
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		const [users, totalCount] = await Promise.all([
			this.txHost.tx.user.findMany({
				where,
				orderBy,
				skip,
				take,
				select: ACCOUNT_SELECT,
			}),
			this.txHost.tx.user.count({ where }),
		]);

		return { data: users, totalCount };
	}

	async getById(userId: string): Promise<IdpAccountDetailInfo> {
		this.logger.debug(`IDP 계정 상세 조회: ${userId.slice(-8)}`);

		const user = await this.findAccountInScope(userId);
		const accessGrants = await this.getAccessGrants(userId);

		return { ...user, accessGrants };
	}

	async getRecentAuditLogs(userId: string, limit = 5) {
		return this.auditLogsRepository.findByUserId(userId, limit);
	}

	async getAccessGrantFormBootstrap(
		userId: string,
	): Promise<IdpAccountAccessGrantFormBootstrap> {
		this.logger.debug(`계정 접근 권한 부여 폼 조회: ${userId.slice(-8)}`);

		await this.findAccountInScope(userId);

		const [spaces, roles] = await Promise.all([
			this.txHost.tx.space.findMany({
				where: this.applySpaceFilter({ removedAt: null }),
				include: { ground: true },
				orderBy: { createdAt: "desc" },
			}),
			this.txHost.tx.role.findMany({
				where: { removedAt: null },
				orderBy: { createdAt: "asc" },
			}),
		]);

		const spaceOptions = spaces.map((space) => ({
			value: space.id,
			label: space.ground?.name ?? space.id,
			description: space.ground?.label ?? space.ground?.address ?? undefined,
		}));
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
			aiSchemas: [],
		};
	}

	async grantAccess(
		userId: string,
		dto: GrantIdpAccountAccessDto,
	): Promise<IdpAccountDetailInfo> {
		this.logger.debug(
			`계정 접근 권한 부여: user=${userId.slice(-8)}, space=${dto.spaceId.slice(-8)}, role=${dto.roleId.slice(-8)}`,
		);

		await this.findAccountInScope(userId);

		const [space, role] = await Promise.all([
			this.txHost.tx.space.findFirst({
				where: this.applySpaceFilter({
					id: dto.spaceId,
					removedAt: null,
				}),
			}),
			this.txHost.tx.role.findFirst({
				where: {
					id: dto.roleId,
					removedAt: null,
				},
			}),
		]);

		if (!space) {
			throw new NotFoundException("권한을 부여할 Space를 찾을 수 없습니다");
		}

		if (!role) {
			throw new NotFoundException("권한을 부여할 Role을 찾을 수 없습니다");
		}

		await this.txHost.tx.tenant.upsert({
			where: {
				userId_spaceId: {
					userId,
					spaceId: dto.spaceId,
				},
			},
			create: {
				userId,
				spaceId: dto.spaceId,
				roleId: dto.roleId,
			},
			update: {
				roleId: dto.roleId,
				removedAt: null,
			},
		});

		return this.getById(userId);
	}

	async toggleActive(userId: string): Promise<IdpAccountInfo> {
		this.logger.debug(`계정 활성/비활성 토글: ${userId.slice(-8)}`);

		const user = await this.txHost.tx.user.findFirst({
			where: this.applySpaceScope({ id: userId, removedAt: null }),
		});

		if (!user) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		const updated = await this.txHost.tx.user.update({
			where: { id: userId },
			data: { isActive: !user.isActive },
			select: ACCOUNT_SELECT,
		});

		return updated;
	}

	async resetFailedAttempts(userId: string): Promise<void> {
		this.logger.debug(`실패 횟수 초기화: ${userId.slice(-8)}`);

		const user = await this.txHost.tx.user.findFirst({
			where: this.applySpaceScope({ id: userId, removedAt: null }),
		});

		if (!user) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		await this.txHost.tx.user.update({
			where: { id: userId },
			data: {
				failedLoginAttempts: 0,
				lockedUntil: null,
				isPermanentlyLocked: false,
			},
		});
	}

	private async findAccountInScope(userId: string): Promise<IdpAccountInfo> {
		const user = await this.txHost.tx.user.findFirst({
			where: this.applySpaceScope({ id: userId, removedAt: null }),
			select: ACCOUNT_SELECT,
		});

		if (!user) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		return user;
	}

	private async getAccessGrants(
		userId: string,
	): Promise<IdpAccountAccessGrantInfo[]> {
		const tenants = await this.txHost.tx.tenant.findMany({
			where: this.applyTenantSpaceScope({
				userId,
				removedAt: null,
			}),
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				role: true,
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return tenants.map((tenant) => ({
			tenantId: tenant.id,
			spaceId: tenant.spaceId,
			spaceName: tenant.space.ground?.name ?? tenant.spaceId,
			spaceLabel: tenant.space.ground?.label ?? null,
			roleId: tenant.roleId,
			roleName: tenant.role.name,
			roleDisplayName: tenant.role.displayName ?? null,
			grantedAt: tenant.createdAt,
			updatedAt: tenant.updatedAt ?? null,
		}));
	}

	private applySpaceScope(where: Prisma.UserWhereInput): Prisma.UserWhereInput {
		const spaceIds = this.spaceContext.spaceIds;
		if (spaceIds === undefined) {
			return where;
		}

		return {
			AND: [
				where,
				{
					tenants: {
						some: {
							spaceId: { in: spaceIds },
							removedAt: null,
						},
					},
				},
			],
		};
	}

	private applyTenantSpaceScope(
		where: Prisma.TenantWhereInput,
	): Prisma.TenantWhereInput {
		const spaceIds = this.spaceContext.spaceIds;
		if (spaceIds === undefined) {
			return where;
		}

		return {
			AND: [
				where,
				{
					spaceId: { in: spaceIds },
				},
			],
		};
	}

	private applySpaceFilter(
		where: Prisma.SpaceWhereInput,
	): Prisma.SpaceWhereInput {
		const spaceIds = this.spaceContext.spaceIds;
		if (spaceIds === undefined) {
			return where;
		}

		return {
			AND: [
				where,
				{
					id: { in: spaceIds },
				},
			],
		};
	}
}
