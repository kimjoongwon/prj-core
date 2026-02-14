import { AuthAuditLog } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
		const { where, orderBy, skip, take } = params;
		this.logger.debug("인증 감사 로그 목록 조회");

		const [logs, totalCount] = await Promise.all([
			this.txHost.tx.authAuditLog.findMany({
				where,
				orderBy,
				skip,
				take,
			}),
			this.txHost.tx.authAuditLog.count({ where }),
		]);

		return {
			logs: logs.map((log) => plainToInstance(AuthAuditLog, log)),
			totalCount,
		};
	}

	/**
	 * 특정 사용자의 최근 인증 로그 조회
	 */
	async findByUserId(userId: string, limit: number): Promise<AuthAuditLog[]> {
		this.logger.debug(`사용자별 인증 로그 조회: ${userId.slice(-8)}, limit=${limit}`);

		const logs = await this.txHost.tx.authAuditLog.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return logs.map((log) => plainToInstance(AuthAuditLog, log));
	}
}
