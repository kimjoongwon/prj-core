import { InquiryMessage } from "@cocrepo/entity";
import { Prisma, PrismaClient, SenderType } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class InquiryMessagesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("InquiryMessagesRepository");
	}

	// ============================================================================
	// 기본 CRUD
	// ============================================================================

	/**
	 * ID로 조회
	 */
	async findById(id: string): Promise<InquiryMessage | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.findUnique({
			where: { id },
		});

		return result ? plainToInstance(InquiryMessage, result) : null;
	}

	/**
	 * 생성
	 */
	async create(
		data: Prisma.InquiryMessageUncheckedCreateInput,
	): Promise<InquiryMessage> {
		this.logger.debug("메시지 생성 중...");

		const result = await this.txHost.tx.inquiryMessage.create({
			data,
		});

		return plainToInstance(InquiryMessage, result);
	}

	/**
	 * 스레드별 메시지 목록 조회
	 */
	async findManyByThreadId(params: {
		threadId: string;
		where?: Prisma.InquiryMessageWhereInput;
		orderBy?: Prisma.InquiryMessageOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		const { threadId, where, orderBy, skip, take } = params;
		this.logger.debug(`스레드별 메시지 조회: ${threadId.slice(-8)}`);

		const baseWhere: Prisma.InquiryMessageWhereInput = {
			threadId,
			isDeleted: false,
			...where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryMessage.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ createdAt: "asc" }],
				skip,
				take,
				include: {
					sender: {
						select: { id: true, name: true, email: true },
					},
					attachments: {
						where: { isDeleted: false },
					},
				},
			}),
			this.txHost.tx.inquiryMessage.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryMessage, item)),
			totalCount,
		};
	}

	/**
	 * 문의별 메시지 목록 조회
	 */
	async findManyByInquiryId(params: {
		inquiryId: string;
		where?: Prisma.InquiryMessageWhereInput;
		orderBy?: Prisma.InquiryMessageOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		const { inquiryId, where, orderBy, skip, take } = params;
		this.logger.debug(`문의별 메시지 조회: ${inquiryId.slice(-8)}`);

		const baseWhere: Prisma.InquiryMessageWhereInput = {
			inquiryId,
			isDeleted: false,
			...where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryMessage.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ createdAt: "asc" }],
				skip,
				take,
				include: {
					sender: {
						select: { id: true, name: true, email: true },
					},
					thread: {
						select: { id: true, title: true },
					},
					attachments: {
						where: { isDeleted: false },
					},
				},
			}),
			this.txHost.tx.inquiryMessage.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryMessage, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 전달/읽음 상태
	// ============================================================================

	/**
	 * 전달 완료 처리
	 */
	async markDeliveredById(id: string): Promise<InquiryMessage> {
		this.logger.debug(`전달 완료 처리: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.update({
			where: { id },
			data: { deliveredAt: new Date() },
		});

		return plainToInstance(InquiryMessage, result);
	}

	/**
	 * 읽음 처리
	 */
	async markReadById(id: string): Promise<InquiryMessage> {
		this.logger.debug(`읽음 처리: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.update({
			where: { id },
			data: { readAt: new Date() },
		});

		return plainToInstance(InquiryMessage, result);
	}

	/**
	 * 스레드의 모든 메시지 읽음 처리
	 */
	async markAllReadByThreadId(
		threadId: string,
		beforeThan?: Date,
	): Promise<number> {
		this.logger.debug(`스레드 메시지 일괄 읽음 처리: ${threadId.slice(-8)}`);

		const where: Prisma.InquiryMessageWhereInput = {
			threadId,
			readAt: null,
		};

		if (beforeThan) {
			where.createdAt = { lte: beforeThan };
		}

		const result = await this.txHost.tx.inquiryMessage.updateMany({
			where,
			data: { readAt: new Date() },
		});

		return result.count;
	}

	// ============================================================================
	// 최신 메시지
	// ============================================================================

	/**
	 * 스레드의 최신 메시지 조회
	 */
	async findLatestByThreadId(threadId: string): Promise<InquiryMessage | null> {
		this.logger.debug(`최신 메시지 조회: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.findFirst({
			where: {
				threadId,
				isDeleted: false,
			},
			orderBy: { createdAt: "desc" },
			include: {
				sender: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return result ? plainToInstance(InquiryMessage, result) : null;
	}

	// ============================================================================
	// 메시지 수
	// ============================================================================

	/**
	 * 스레드별 메시지 수 조회
	 */
	async countByThreadId(threadId: string): Promise<number> {
		this.logger.debug(`메시지 수 조회: ${threadId.slice(-8)}`);

		return this.txHost.tx.inquiryMessage.count({
			where: {
				threadId,
				isDeleted: false,
			},
		});
	}

	/**
	 * 문의별 메시지 수 조회
	 */
	async countByInquiryId(inquiryId: string): Promise<number> {
		this.logger.debug(`문의별 메시지 수 조회: ${inquiryId.slice(-8)}`);

		return this.txHost.tx.inquiryMessage.count({
			where: {
				inquiryId,
				isDeleted: false,
			},
		});
	}

	// ============================================================================
	// 수정/삭제
	// ============================================================================

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.InquiryMessageUncheckedUpdateInput,
	): Promise<InquiryMessage> {
		this.logger.debug(`메시지 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.update({
			where: { id },
			data,
		});

		return plainToInstance(InquiryMessage, result);
	}

	/**
	 * 소프트 삭제 (내용 숨김)
	 */
	async removeById(id: string): Promise<InquiryMessage> {
		this.logger.debug(`메시지 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.update({
			where: { id },
			data: {
				isDeleted: true,
				content: "[삭제된 메시지입니다]",
			},
		});

		return plainToInstance(InquiryMessage, result);
	}

	// ============================================================================
	// 중복 방지
	// ============================================================================

	/**
	 * 클라이언트 메시지 ID로 존재 확인
	 */
	async existsByClientMessageId(
		threadId: string,
		clientMessageId: string,
	): Promise<boolean> {
		const message = await this.txHost.tx.inquiryMessage.findUnique({
			where: {
				threadId_clientMessageId: {
					threadId,
					clientMessageId,
				},
			},
			select: { id: true },
		});

		return message !== null;
	}

	// ============================================================================
	// 발신자 유형별 조회
	// ============================================================================

	/**
	 * 발신자 유형별 메시지 목록 조회
	 */
	async findManyBySenderType(params: {
		inquiryId: string;
		senderType: SenderType;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		const { inquiryId, senderType, skip, take } = params;
		this.logger.debug(`발신자 유형별 메시지 조회: ${senderType}`);

		const where: Prisma.InquiryMessageWhereInput = {
			inquiryId,
			senderType,
			isDeleted: false,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryMessage.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.inquiryMessage.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryMessage, item)),
			totalCount,
		};
	}
}
