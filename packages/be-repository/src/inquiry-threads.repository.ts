import {
	InquiryThread,
	InquiryMessage,
	InquiryParticipant,
} from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class InquiryThreadsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("InquiryThreadsRepository");
	}

	async findById(id: string): Promise<InquiryThread | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	async findByIdWithMessagesAndParticipants(
		id: string,
	): Promise<InquiryThread | null> {
		this.logger.debug(`메시지/참여자 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
			include: {
				messages: {
					orderBy: { createdAt: "asc" },
				},
				participants: true,
				inquiry: true,
			},
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	async findByInquiryId(inquiryId: string): Promise<InquiryThread[]> {
		this.logger.debug(`문의별 스레드 조회: ${inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findMany({
			where: { inquiryId },
			orderBy: [{ createdAt: "asc" }],
		});

		return result.map((item) => plainToInstance(InquiryThread, item));
	}

	async findMessagesByThreadId(threadId: string): Promise<InquiryMessage[]> {
		this.logger.debug(`스레드 메시지 조회: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.findMany({
			where: { threadId },
			orderBy: [{ createdAt: "asc" }],
		});

		return result.map((item) => plainToInstance(InquiryMessage, item));
	}

	async findParticipantsByThreadId(
		threadId: string,
	): Promise<InquiryParticipant[]> {
		this.logger.debug(`스레드 참여자 조회: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.findMany({
			where: { threadId },
			orderBy: [{ joinedAt: "asc" }],
		});

		return result.map((item) => plainToInstance(InquiryParticipant, item));
	}

	async findMany(params: {
		where?: Prisma.InquiryThreadWhereInput;
		orderBy?: Prisma.InquiryThreadOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ threads: InquiryThread[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		const [threads, totalCount] = await Promise.all([
			this.txHost.tx.inquiryThread.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "asc" }],
				skip,
				take,
			}),
			this.txHost.tx.inquiryThread.count({ where }),
		]);

		return {
			threads: threads.map((item) => plainToInstance(InquiryThread, item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.InquiryThreadUncheckedCreateInput,
	): Promise<InquiryThread> {
		this.logger.debug(`생성: 문의 ${data.inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.create({
			data,
		});

		return plainToInstance(InquiryThread, result);
	}

	async updateById(
		id: string,
		data: Prisma.InquiryThreadUncheckedUpdateInput,
	): Promise<InquiryThread> {
		this.logger.debug(`수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data,
		});

		return plainToInstance(InquiryThread, result);
	}

	async removeById(id: string): Promise<InquiryThread> {
		this.logger.debug(`삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.delete({ where: { id } });

		return plainToInstance(InquiryThread, result);
	}
}
