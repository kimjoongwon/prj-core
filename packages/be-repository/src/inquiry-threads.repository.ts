import {
	InquiryMessage,
	InquiryParticipant,
	InquiryThread,
} from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainEntity } from "./to-domain-entity";

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
			include: { inquiry: true, createdBy: true },
		});

		return result ? toDomainEntity(InquiryThread, result) : null;
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
					include: {
						thread: { select: { id: true } },
						inquiry: { select: { id: true } },
						sender: true,
					},
				},
				participants: {
					include: {
						inquiry: { select: { id: true } },
						thread: { select: { id: true } },
						user: true,
					},
				},
				inquiry: true,
				createdBy: true,
			},
		});

		return result ? toDomainEntity(InquiryThread, result) : null;
	}

	async findByInquiryId(inquiryId: string): Promise<InquiryThread[]> {
		this.logger.debug(`문의별 스레드 조회: ${inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findMany({
			where: { inquiry: { id: inquiryId } },
			include: { inquiry: true, createdBy: true },
			orderBy: [{ createdAt: "asc" }],
		});

		return result.map((item) => toDomainEntity(InquiryThread, item));
	}

	async findMessagesByThreadId(threadId: string): Promise<InquiryMessage[]> {
		this.logger.debug(`스레드 메시지 조회: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.findMany({
			where: { thread: { id: threadId } },
			include: {
				thread: { select: { id: true } },
				inquiry: { select: { id: true } },
				sender: true,
			},
			orderBy: [{ createdAt: "asc" }],
		});

		return result.map((item) => toDomainEntity(InquiryMessage, item));
	}

	async findParticipantsByThreadId(
		threadId: string,
	): Promise<InquiryParticipant[]> {
		this.logger.debug(`스레드 참여자 조회: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryParticipant.findMany({
			where: { thread: { id: threadId } },
			include: {
				inquiry: { select: { id: true } },
				thread: { select: { id: true } },
				user: true,
			},
			orderBy: [{ joinedAt: "asc" }],
		});

		return result.map((item) => toDomainEntity(InquiryParticipant, item));
	}

	async findMany(params: {
		where?: Prisma.InquiryThreadWhereInput;
		orderBy?: Prisma.InquiryThreadOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ threads: InquiryThread[]; totalCount: number }> {
		const [threads, totalCount] = await Promise.all([
			this.txHost.tx.inquiryThread.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "asc" }],
				skip: params.skip,
				take: params.take,
				include: { inquiry: true, createdBy: true },
			}),
			this.txHost.tx.inquiryThread.count({ where: params.where }),
		]);

		return {
			threads: threads.map((item) => toDomainEntity(InquiryThread, item)),
			totalCount,
		};
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.InquiryThreadUncheckedCreateInput,
			"inquiry" | "createdBy"
		>,
	): Promise<InquiryThread> {
		this.logger.debug(`생성: 문의 ${data.inquiryId.slice(-8)}`);

		const { inquiryId, createdById, ...threadData } = data;
		const result = await this.txHost.tx.inquiryThread.create({
			data: {
				...threadData,
				inquiry: { connect: { id: inquiryId } },
				createdBy: { connect: { id: createdById } },
			},
			include: { inquiry: true, createdBy: true },
		});

		return toDomainEntity(InquiryThread, result);
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.InquiryThreadUncheckedUpdateInput,
			"inquiry" | "createdBy"
		>,
	): Promise<InquiryThread> {
		this.logger.debug(`수정: ${id.slice(-8)}`);

		const { inquiryId, createdById, ...threadData } = data;
		const result = await this.txHost.tx.inquiryThread.update({
			where: { id },
			data: {
				...threadData,
				...(inquiryId !== undefined
					? { inquiry: { connect: { id: inquiryId } } }
					: {}),
				...(createdById !== undefined
					? { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: { inquiry: true, createdBy: true },
		});

		return toDomainEntity(InquiryThread, result);
	}

	async removeById(id: string): Promise<InquiryThread> {
		this.logger.debug(`삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.delete({
			where: { id },
			include: { inquiry: true, createdBy: true },
		});

		return toDomainEntity(InquiryThread, result);
	}
}
