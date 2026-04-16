import { SpaceContext } from "@cocrepo/context";
import type { QueryIdpAccountDto } from "@cocrepo/dto";
import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@cocrepo/prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

export interface IdpAccountInfo {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
	failedLoginAttempts: number;
	isPermanentlyLocked: boolean;
	lockedUntil: Date | null;
	mustChangePassword: boolean;
	lastLoginAt: Date | null;
	lastLoginIp: string | null;
	createdAt: Date;
}

/** 공통 select 필드 */
const ACCOUNT_SELECT = {
	id: true,
	name: true,
	email: true,
	isActive: true,
	failedLoginAttempts: true,
	isPermanentlyLocked: true,
	lockedUntil: true,
	mustChangePassword: true,
	lastLoginAt: true,
	lastLoginIp: true,
	createdAt: true,
} as const;

@Injectable()
export class IdpAccountService {
	private readonly logger = new Logger(IdpAccountService.name);

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

	async getById(userId: string): Promise<IdpAccountInfo> {
		this.logger.debug(`IDP 계정 상세 조회: ${userId.slice(-8)}`);

		const user = await this.txHost.tx.user.findFirst({
			where: this.applySpaceScope({ id: userId, removedAt: null }),
			select: ACCOUNT_SELECT,
		});

		if (!user) {
			throw new NotFoundException("계정을 찾을 수 없습니다");
		}

		return user;
	}

	async getRecentAuditLogs(userId: string, limit = 5) {
		return this.auditLogsRepository.findByUserId(userId, limit);
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

	private applySpaceScope(
		where: Prisma.UserWhereInput,
	): Prisma.UserWhereInput {
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
}
