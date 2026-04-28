import { AIAgentLog } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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

	async findById(id: string): Promise<AIAgentLog | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIAgentLog.findUnique({
			where: { id },
		});

		return result ? plainToInstance(AIAgentLog, result) : null;
	}

	async findByInquiryId(inquiryId: string): Promise<AIAgentLog[]> {
		this.logger.debug(`문의별 AI 로그 조회: ${inquiryId.slice(-8)}`);

		const results = await this.txHost.tx.aIAgentLog.findMany({
			where: { inquiryId },
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((item) => plainToInstance(AIAgentLog, item));
	}

	async findByMessageId(messageId: string): Promise<AIAgentLog | null> {
		this.logger.debug(`메시지별 AI 로그 조회: ${messageId}`);

		const result = await this.txHost.tx.aIAgentLog.findUnique({
			where: { messageId },
		});

		return result ? plainToInstance(AIAgentLog, result) : null;
	}

	async findMany(params: {
		where?: Prisma.AIAgentLogWhereInput;
		orderBy?: Prisma.AIAgentLogOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ logs: AIAgentLog[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;

		const [logs, totalCount] = await Promise.all([
			this.txHost.tx.aIAgentLog.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.aIAgentLog.count({ where }),
		]);

		return {
			logs: logs.map((log) => plainToInstance(AIAgentLog, log)),
			totalCount,
		};
	}

	async create(
		data: Prisma.AIAgentLogUncheckedCreateInput,
	): Promise<AIAgentLog> {
		this.logger.debug(`로그 생성: ${data.inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.aIAgentLog.create({ data });

		return plainToInstance(AIAgentLog, result);
	}

	async deleteById(id: string): Promise<AIAgentLog> {
		this.logger.debug(`로그 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIAgentLog.delete({ where: { id } });

		return plainToInstance(AIAgentLog, result);
	}

	async countByInquiryId(inquiryId: string): Promise<number> {
		return this.txHost.tx.aIAgentLog.count({
			where: { inquiryId },
		});
	}
}
