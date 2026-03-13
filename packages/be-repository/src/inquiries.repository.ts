import { Inquiry, InquiryMessage, InquiryParticipant, InquiryThread } from "@cocrepo/entity";
import {
	InquiryCategory,
	InquiryPriority,
	InquiryStatus,
	Prisma,
	PrismaClient,
	SentimentType,
} from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class InquiriesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("InquiriesRepository");
	}

	// ============================================================================
	// 기본 CRUD
	// ============================================================================

	/**
	 * ID로 조회 (기본 정보만)
	 */
	async findById(id: string): Promise<Inquiry | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Inquiry, result) : null;
	}

	/**
	 * ID로 조회 (스레드, 메시지, 참여자 포함)
	 */
	async findByIdWithThreadsAndMessagesAndParticipants(
		id: string,
	): Promise<Inquiry | null> {
		this.logger.debug(`ID로 상세 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.findUnique({
			where: { id },
			include: {
				threads: {
					orderBy: { createdAt: "desc" },
				},
				messages: {
					take: 50,
					orderBy: { createdAt: "desc" },
				},
				participants: true,
				customer: true,
				assignee: true,
				tags: true,
				sentimentAnalysis: true,
			},
		});

		return result ? plainToInstance(Inquiry, result) : null;
	}

	/**
	 * 문의 번호로 조회
	 */
	async findByNumber(inquiryNumber: string): Promise<Inquiry | null> {
		this.logger.debug(`문의 번호로 조회: ${inquiryNumber}`);

		const result = await this.txHost.tx.inquiry.findUnique({
			where: { inquiryNumber },
		});

		return result ? plainToInstance(Inquiry, result) : null;
	}

	/**
	 * 목록 조회 (페이지네이션)
	 */
	async findMany(params: {
		where: Prisma.InquiryWhereInput;
		orderBy: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		this.logger.debug("문의 목록 조회");

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where,
				orderBy,
				skip,
				take,
				include: {
					customer: {
						select: { id: true, name: true, email: true },
					},
					assignee: {
						select: { id: true, name: true, email: true },
					},
					tags: true,
				},
			}),
			this.txHost.tx.inquiry.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Inquiry, item)),
			totalCount,
		};
	}

	/**
	 * 생성
	 */
	async create(data: Prisma.InquiryUncheckedCreateInput): Promise<Inquiry> {
		this.logger.debug("문의 생성 중...");

		const result = await this.txHost.tx.inquiry.create({
			data,
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 문의의 기본 스레드 생성
	 */
	async createThread(
		data: Prisma.InquiryThreadUncheckedCreateInput,
	): Promise<InquiryThread> {
		this.logger.debug(`문의 스레드 생성: ${data.inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.create({
			data,
		});

		return plainToInstance(InquiryThread, result);
	}

	/**
	 * 문의의 기본 스레드 조회
	 */
	async findDefaultThreadByInquiryId(
		inquiryId: string,
	): Promise<InquiryThread | null> {
		this.logger.debug(`기본 스레드 조회: ${inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findFirst({
			where: {
				inquiryId,
			},
			orderBy: { createdAt: "asc" },
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	/**
	 * 스레드 ID로 조회
	 */
	async findThreadById(id: string): Promise<InquiryThread | null> {
		this.logger.debug(`스레드 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
		});

		return result ? plainToInstance(InquiryThread, result) : null;
	}

	/**
	 * 문의별 메시지 목록 조회
	 */
	async findMessagesByInquiryId(params: {
		inquiryId: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		const { inquiryId, skip, take } = params;
		this.logger.debug(`문의별 메시지 조회: ${inquiryId.slice(-8)}`);

		const where: Prisma.InquiryMessageWhereInput = {
			inquiryId,
			isDeleted: false,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryMessage.findMany({
				where,
				orderBy: [{ createdAt: "asc" }],
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
			this.txHost.tx.inquiryMessage.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(InquiryMessage, item)),
			totalCount,
		};
	}

	/**
	 * clientMessageId 중복 여부 확인
	 */
	async existsMessageByClientMessageId(
		threadId: string,
		clientMessageId: string,
	): Promise<boolean> {
		const count = await this.txHost.tx.inquiryMessage.count({
			where: {
				threadId,
				clientMessageId,
			},
		});

		return count > 0;
	}

	/**
	 * 메시지 생성
	 */
	async createMessage(
		data: Prisma.InquiryMessageUncheckedCreateInput,
	): Promise<InquiryMessage> {
		this.logger.debug(`메시지 생성: ${data.inquiryId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryMessage.create({
			data,
			include: {
				sender: {
					select: { id: true, name: true, email: true },
				},
				thread: {
					select: { id: true, title: true },
				},
			},
		});

		return plainToInstance(InquiryMessage, result);
	}

	/**
	 * 메시지 생성 후 스레드 집계 반영
	 */
	async touchThreadAfterMessage(
		threadId: string,
		preview: string,
	): Promise<InquiryThread> {
		this.logger.debug(`스레드 마지막 메시지 갱신: ${threadId.slice(-8)}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id: threadId },
			data: {
				lastMessageAt: new Date(),
				lastMessagePreview: preview.slice(0, 100),
				messageCount: { increment: 1 },
			},
		});

		return plainToInstance(InquiryThread, result);
	}

	/**
	 * 참여자 목록 조회
	 */
	async findParticipantsByInquiryId(
		inquiryId: string,
	): Promise<InquiryParticipant[]> {
		this.logger.debug(`참여자 조회: ${inquiryId.slice(-8)}`);

		const results = await this.txHost.tx.inquiryParticipant.findMany({
			where: {
				inquiryId,
				leftAt: null,
			},
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return results.map((result) => plainToInstance(InquiryParticipant, result));
	}

	async incrementParticipantUnreadByInquiryId(
		inquiryId: string,
		excludeUserId?: string,
	): Promise<number> {
		const result = await this.txHost.tx.inquiryParticipant.updateMany({
			where: {
				inquiryId,
				leftAt: null,
				...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
			},
			data: {
				unreadCount: { increment: 1 },
			},
		});

		return result.count;
	}

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.InquiryUncheckedUpdateInput,
	): Promise<Inquiry> {
		this.logger.debug(`업데이트 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data,
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 소프트 삭제
	 */
	async removeById(id: string): Promise<Inquiry> {
		this.logger.debug(`소프트 삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Inquiry, result);
	}

	// ============================================================================
	// 담당자 관련
	// ============================================================================

	/**
	 * 담당자 배정
	 */
	async updateAssigneeById(id: string, assigneeId: string): Promise<Inquiry> {
		this.logger.debug(
			`담당자 배정: ${id.slice(-8)} -> ${assigneeId.slice(-8)}`,
		);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				assigneeId,
				status: "OPEN",
			},
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 담당자별 문의 목록 조회
	 */
	async findManyByAssigneeId(params: {
		assigneeId: string;
		where?: Prisma.InquiryWhereInput;
		orderBy?: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		const { assigneeId, where, orderBy, skip, take } = params;
		this.logger.debug(`담당자별 문의 조회: ${assigneeId.slice(-8)}`);

		const baseWhere: Prisma.InquiryWhereInput = {
			assigneeId,
			removedAt: null,
			...where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ priority: "desc" }, { createdAt: "desc" }],
				skip,
				take,
				include: {
					customer: {
						select: { id: true, name: true, email: true },
					},
					tags: true,
				},
			}),
			this.txHost.tx.inquiry.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Inquiry, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 고객 관련
	// ============================================================================

	/**
	 * 고객별 문의 목록 조회
	 */
	async findManyByCustomerId(params: {
		customerId: string;
		where?: Prisma.InquiryWhereInput;
		orderBy?: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		const { customerId, where, orderBy, skip, take } = params;
		this.logger.debug(`고객별 문의 조회: ${customerId.slice(-8)}`);

		const baseWhere: Prisma.InquiryWhereInput = {
			customerId,
			removedAt: null,
			...where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
				include: {
					assignee: {
						select: { id: true, name: true, email: true },
					},
					tags: true,
				},
			}),
			this.txHost.tx.inquiry.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Inquiry, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 상태 관련
	// ============================================================================

	/**
	 * 상태 업데이트
	 */
	async updateStatusById(id: string, status: InquiryStatus): Promise<Inquiry> {
		this.logger.debug(`상태 업데이트: ${id.slice(-8)} -> ${status}`);

		const updateData: Prisma.InquiryUncheckedUpdateInput = { status };

		// 상태에 따른 추가 필드 업데이트
		if (status === "RESOLVED") {
			updateData.resolvedAt = new Date();
		} else if (status === "CLOSED") {
			updateData.closedAt = new Date();
		}

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: updateData,
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 우선순위 업데이트
	 */
	async updatePriorityById(
		id: string,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		this.logger.debug(`우선순위 업데이트: ${id.slice(-8)} -> ${priority}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { priority },
		});

		return plainToInstance(Inquiry, result);
	}

	// ============================================================================
	// SLA 관련
	// ============================================================================

	/**
	 * SLA 초과 문의 목록 조회
	 */
	async findOverdueSla(params?: {
		spaceId?: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		this.logger.debug("SLA 초과 문의 조회");

		const now = new Date();
		const where: Prisma.InquiryWhereInput = {
			removedAt: null,
			resolvedAt: null,
			OR: [
				{
					slaResponseDue: { lt: now },
					firstResponseAt: null,
				},
				{
					slaResolveDue: { lt: now },
				},
			],
		};

		if (params?.spaceId) {
			where.spaceId = params.spaceId;
		}

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where,
				orderBy: { createdAt: "asc" },
				skip: params?.skip,
				take: params?.take,
				include: {
					customer: {
						select: { id: true, name: true, email: true },
					},
					assignee: {
						select: { id: true, name: true, email: true },
					},
				},
			}),
			this.txHost.tx.inquiry.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Inquiry, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 통계 관련
	// ============================================================================

	/**
	 * 상태별 문의 수 조회
	 */
	async countByStatus(spaceId: string): Promise<
		{
			status: InquiryStatus;
			count: number;
		}[]
	> {
		this.logger.debug(`상태별 문의 수 조회: ${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.inquiry.groupBy({
			by: ["status"],
			where: {
				spaceId,
				removedAt: null,
			},
			_count: {
				id: true,
			},
		});

		return results.map((result) => ({
			status: result.status,
			count: result._count.id,
		}));
	}

	/**
	 * 카테고리별 문의 수 조회
	 */
	async countByCategory(spaceId: string): Promise<
		{
			category: InquiryCategory;
			count: number;
		}[]
	> {
		this.logger.debug(`카테고리별 문의 수 조회: ${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.inquiry.groupBy({
			by: ["category"],
			where: {
				spaceId,
				removedAt: null,
			},
			_count: {
				id: true,
			},
		});

		return results.map((result) => ({
			category: result.category,
			count: result._count.id,
		}));
	}

	/**
	 * SLA 위반 문의 수 조회
	 */
	async countOverdue(spaceId: string): Promise<{
		responseOverdue: number;
		resolveOverdue: number;
		total: number;
	}> {
		this.logger.debug(`SLA 위반 문의 수 조회: ${spaceId.slice(-8)}`);

		const now = new Date();
		const baseWhere: Prisma.InquiryWhereInput = {
			spaceId,
			removedAt: null,
			resolvedAt: null,
		};

		const [responseOverdue, resolveOverdue] = await Promise.all([
			this.txHost.tx.inquiry.count({
				where: {
					...baseWhere,
					slaResponseDue: { lt: now },
					firstResponseAt: null,
				},
			}),
			this.txHost.tx.inquiry.count({
				where: {
					...baseWhere,
					slaResolveDue: { lt: now },
				},
			}),
		]);

		return {
			responseOverdue,
			resolveOverdue,
			total: responseOverdue + resolveOverdue,
		};
	}

	// ============================================================================
	// 감정 분석 관련
	// ============================================================================

	/**
	 * 감정 분석 업데이트
	 */
	async updateSentimentById(
		id: string,
		sentiment: SentimentType,
		sentimentScore: number,
	): Promise<Inquiry> {
		this.logger.debug(`감정 분석 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { sentiment, sentimentScore },
		});

		return plainToInstance(Inquiry, result);
	}

	// ============================================================================
	// 읽음 상태 관련
	// ============================================================================

	/**
	 * 읽지 않은 메시지 수 초기화
	 */
	async resetUnreadCountById(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 초기화: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { unreadCount: 0 },
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	async incrementUnreadCountById(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 증가: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				unreadCount: { increment: 1 },
			},
		});

		return plainToInstance(Inquiry, result);
	}

	/**
	 * 마지막 메시지 시각 및 unreadCount 반영
	 */
	async recordMessageActivityById(id: string): Promise<Inquiry> {
		this.logger.debug(`문의 메시지 활동 반영: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				lastMessageAt: new Date(),
				unreadCount: { increment: 1 },
			},
		});

		return plainToInstance(Inquiry, result);
	}

	// ============================================================================
	// 첫 응답 관련
	// ============================================================================

	/**
	 * 첫 응답 시간 기록
	 */
	async recordFirstResponseById(id: string): Promise<Inquiry> {
		this.logger.debug(`첫 응답 기록: ${id.slice(-8)}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				firstResponseAt: new Date(),
			},
		});

		return plainToInstance(Inquiry, result);
	}
}
