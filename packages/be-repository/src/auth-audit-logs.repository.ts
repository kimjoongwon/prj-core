import { AuthAuditLog } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class AuthAuditLogsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AuthAuditLogsRepository");
	}

	/**
	 * 목록 조회 (필터링, 페이지네이션 지원)
	 */
	async findMany(params: {
		where: Prisma.AuthAuditLogWhereInput;
		orderBy: Record<string, "asc" | "desc">[];
		skip: number;
		take: number;
	}): Promise<{ logs: AuthAuditLog[]; totalCount: number }> {
		this.logger.debug("인증 감사 로그 목록 조회");

		const [logs, totalCount] = await Promise.all([
			this.txHost.tx.authAuditLog.findMany({
				where: params.where,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
				include: { user: true },
			}),
			this.txHost.tx.authAuditLog.count({ where: params.where }),
		]);

		return {
			logs: logs.map((log) => toDomainEntity(AuthAuditLog, log)),
			totalCount,
		};
	}

	/**
	 * 조건별 건수 조회
	 */
	async count(where: Prisma.AuthAuditLogWhereInput): Promise<number> {
		return this.txHost.tx.authAuditLog.count({ where });
	}

	/**
	 * 특정 사용자의 최근 인증 로그 조회
	 */
	async findByUserId(userId: bigint, limit: number): Promise<AuthAuditLog[]> {
		this.logger.debug(`사용자별 인증 로그 조회: ${userId}, limit=${limit}`);

		const logs = await this.txHost.tx.authAuditLog.findMany({
			where: { userId },
			include: { user: true },
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return logs.map((log) => toDomainEntity(AuthAuditLog, log));
	}
}
