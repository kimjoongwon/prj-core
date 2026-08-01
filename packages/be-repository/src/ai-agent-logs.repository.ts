import { AIAgentLog } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { PublicIdCreateInput } from "./public-id-input.type";
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

	async findById(id: string): Promise<AIAgentLog | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIAgentLog.findUnique({
			where: { id },
			include: { inquiry: true, message: true },
		});

		return result ? toDomainEntity(AIAgentLog, result) : null;
	}

	async findByInquiryId(inquiryId: string): Promise<AIAgentLog[]> {
		this.logger.debug(`문의별 AI 로그 조회: ${inquiryId.slice(-8)}`);

		const results = await this.txHost.tx.aIAgentLog.findMany({
			where: { inquiry: { id: inquiryId } },
			include: { inquiry: true, message: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((item) => toDomainEntity(AIAgentLog, item));
	}

	async findByMessageId(messageId: string): Promise<AIAgentLog | null> {
		this.logger.debug(`메시지별 AI 로그 조회: ${messageId}`);

		const result = await this.txHost.tx.aIAgentLog.findFirst({
			where: { message: { id: messageId } },
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
		data: PublicIdCreateInput<
			Prisma.AIAgentLogUncheckedCreateInput,
			"inquiry",
			"message"
		>,
	): Promise<AIAgentLog> {
		this.logger.debug(`로그 생성: ${data.inquiryId.slice(-8)}`);

		const { inquiryId, messageId, ...logData } = data;
		const result = await this.txHost.tx.aIAgentLog.create({
			data: {
				...logData,
				inquiry: { connect: { id: inquiryId } },
				...(messageId ? { message: { connect: { id: messageId } } } : {}),
			},
			include: { inquiry: true, message: true },
		});

		return toDomainEntity(AIAgentLog, result);
	}

	async deleteById(id: string): Promise<AIAgentLog> {
		this.logger.debug(`로그 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIAgentLog.delete({
			where: { id },
			include: { inquiry: true, message: true },
		});

		return toDomainEntity(AIAgentLog, result);
	}

	async countByInquiryId(inquiryId: string): Promise<number> {
		return this.txHost.tx.aIAgentLog.count({
			where: { inquiry: { id: inquiryId } },
		});
	}
}
