import { Grant } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * GranteeType Enum (권한 대상 유형)
 */
export enum GranteeType {
	Role = "Role",
	User = "User",
}

/**
 * Grants Repository
 *
 * @description
 * Role 또는 User에 Ability를 부여하는 다형성 BRIDGE 테이블 Repository
 */
@Injectable()
export class GrantsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("GrantsRepository");
	}

	// ============================================================================
	// Polymorphic Query Methods
	// ============================================================================

	/**
	 * Grantee 유형과 ID 목록으로 Grant 조회
	 *
	 * @param granteeType - 권한 대상 유형 (Role | User)
	 * @param granteeIds - 권한 대상 ID 배열
	 * @param options - 옵션 (Ability 포함 여부)
	 * @returns Grant 배열
	 */
	async findByGranteeTypeAndIds(
		granteeType: GranteeType,
		granteeIds: string[],
		options?: { includeAbility?: boolean },
	): Promise<Grant[]> {
		this.logger.debug(
			`Grantee로 Grant 조회: type=${granteeType}, count=${granteeIds.length}, includeAbility=${options?.includeAbility ?? false}`,
		);

		const include = options?.includeAbility
			? {
					ability: {
						include: {
							subject: true,
							action: true,
						},
					},
				}
			: undefined;

		const results = await this.txHost.tx.grant.findMany({
			where: {
				granteeType,
				granteeId: { in: granteeIds },
				isActive: true,
				removedAt: null,
			},
			include,
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Grant, result));
	}

	/**
	 * Ability ID로 Grant 조회
	 *
	 * @param abilityId - Ability ID
	 * @returns Grant 배열
	 */
	async findByAbilityId(abilityId: string): Promise<Grant[]> {
		this.logger.debug(`Ability ID로 Grant 조회: abilityId=${abilityId.slice(-8)}`);

		const results = await this.txHost.tx.grant.findMany({
			where: {
				abilityId,
				isActive: true,
				removedAt: null,
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Grant, result));
	}

	/**
	 * 여러 Role ID로 활성화된 Grant 조회
	 * - Ability, Subject, Action 포함
	 *
	 * @param roleIds - Role ID 배열
	 * @returns Grant 배열 (Ability 포함)
	 */
	async findActiveByRoleIds(roleIds: string[]): Promise<Grant[]> {
		this.logger.debug(`Role ID로 Grant 조회: roleIds.length=${roleIds.length}`);

		return this.findByGranteeTypeAndIds(GranteeType.Role, roleIds, {
			includeAbility: true,
		});
	}

	/**
	 * User ID로 활성화된 Grant 조회 (예외 권한)
	 * - Ability, Subject, Action 포함
	 *
	 * @param userId - User ID
	 * @returns Grant 배열 (Ability 포함)
	 */
	async findActiveByUserId(userId: string): Promise<Grant[]> {
		this.logger.debug(`User ID로 Grant 조회: userId=${userId.slice(-8)}`);

		return this.findByGranteeTypeAndIds(GranteeType.User, [userId], {
			includeAbility: true,
		});
	}

	// ============================================================================
	// CRUD Methods
	// ============================================================================

	/**
	 * Grant 생성
	 */
	async create(data: Prisma.GrantUncheckedCreateInput): Promise<Grant> {
		this.logger.debug(
			`Grant 생성: granteeType=${data.granteeType}, granteeId=${data.granteeId.slice(-8)}, abilityId=${data.abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.grant.create({
			data,
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(Grant, result);
	}

	/**
	 * Grant 다중 생성 (Bulk insert)
	 */
	async createMany(data: Prisma.GrantCreateManyInput[]): Promise<number> {
		this.logger.debug(`Grant 다중 생성: count=${data.length}`);

		const result = await this.txHost.tx.grant.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}

	/**
	 * Grant 수정 (활성화 여부, 우선순위)
	 */
	async update(
		id: string,
		data: Prisma.GrantUncheckedUpdateInput,
	): Promise<Grant> {
		this.logger.debug(`Grant 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.grant.update({
			where: { id },
			data,
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(Grant, result);
	}

	/**
	 * Grant 소프트 삭제
	 */
	async softDelete(id: string): Promise<Grant> {
		this.logger.debug(`Grant 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.grant.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(Grant, result);
	}

	/**
	 * Ability ID로 모든 Grant 소프트 삭제
	 */
	async deleteByAbilityId(abilityId: string): Promise<number> {
		this.logger.debug(
			`Ability ID로 Grant 소프트 삭제: abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.grant.updateMany({
			where: {
				abilityId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}
}
