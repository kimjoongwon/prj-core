import { AIAgentLog } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { AutoIdentityCreateInput } from "./auto-identity-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class AIAgentLogsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AIAgentLogsRepository");
	}

	async findById(id: bigint): Promise<AIAgentLog | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.aIAgentLog.findUnique({
			where: { id },
			include: { inquiry: true, message: true },
		});

		return result ? toDomainEntity(AIAgentLog, result) : null;
	}

	async findByInquiryId(inquiryId: bigint): Promise<AIAgentLog[]> {
		this.logger.debug(`문의별 AI 로그 조회: ${inquiryId.toString()}`);

		const results = await this.txHost.tx.aIAgentLog.findMany({
			where: { inquiryId },
			include: { inquiry: true, message: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((item) => toDomainEntity(AIAgentLog, item));
	}

	async findByMessageId(messageId: bigint): Promise<AIAgentLog | null> {
		this.logger.debug(`메시지별 AI 로그 조회: ${messageId}`);

		const result = await this.txHost.tx.aIAgentLog.findFirst({
			where: { messageId },
			include: { inquiry: true, message: true },
		});

		return result ? toDomainEntity(AIAgentLog, result) : null;
	}

	async findMany(params: {
		where?: Prisma.AIAgentLogWhereInput;
		orderBy?: Prisma.AIAgentLogOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ logs: AIAgentLog[]; totalCount: number }> {
		const [logs, totalCount] = await Promise.all([
			this.txHost.tx.aIAgentLog.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: { inquiry: true, message: true },
			}),
			this.txHost.tx.aIAgentLog.count({ where: params.where }),
		]);

		return {
			logs: logs.map((log) => toDomainEntity(AIAgentLog, log)),
			totalCount,
		};
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.AIAgentLogUncheckedCreateInput,
			"aiAgentLogId"
		>,
	): Promise<AIAgentLog> {
		this.logger.debug(`로그 생성: ${data.inquiryId.toString()}`);
		const result = await this.txHost.tx.aIAgentLog.create({
			data,
			include: { inquiry: true, message: true },
		});

		return toDomainEntity(AIAgentLog, result);
	}

	async deleteById(id: bigint): Promise<AIAgentLog> {
		this.logger.debug(`로그 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.aIAgentLog.delete({
			where: { id },
			include: { inquiry: true, message: true },
		});

		return toDomainEntity(AIAgentLog, result);
	}

	async countByInquiryId(inquiryId: bigint): Promise<number> {
		return this.txHost.tx.aIAgentLog.count({
			where: { inquiryId },
		});
	}
}
