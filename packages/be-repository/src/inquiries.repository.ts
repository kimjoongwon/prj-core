import {
	Inquiry,
	InquiryMessage,
	InquiryParticipant,
	InquiryThread,
} from "@cocrepo/entity";
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
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainEntity } from "./to-domain-entity";

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
	async findById(id: bigint): Promise<Inquiry | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.findUnique({
			where: { id },
			include: this.includeInquiryRelations(),
		});

		return result ? toDomainEntity(Inquiry, result) : null;
	}

	/**
	 * ID로 조회 (스레드, 메시지, 참여자 포함)
	 */
	async findByIdWithThreadsAndMessagesAndParticipants(
		id: bigint,
		spaceIds?: bigint[],
	): Promise<Inquiry | null> {
		this.logger.debug(`ID로 상세 조회: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.findFirst({
			where: {
				id,
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			},
			include: {
				...this.includeInquiryRelations(),
				threads: {
					orderBy: { createdAt: "desc" },
					include: {
						inquiry: { select: { id: true } },
						createdBy: true,
					},
				},
				messages: {
					take: 50,
					orderBy: { createdAt: "desc" },
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
				customer: true,
				assignee: true,
				tags: { include: { inquiry: { select: { id: true } } } },
				sentimentAnalysis: true,
			},
		});

		return result ? toDomainEntity(Inquiry, result) : null;
	}

	/**
	 * 문의 번호로 조회
	 */
	async findByNumber(inquiryNumber: string): Promise<Inquiry | null> {
		this.logger.debug(`문의 번호로 조회: ${inquiryNumber}`);

		const result = await this.txHost.tx.inquiry.findUnique({
			where: { inquiryNumber },
			include: this.includeInquiryRelations(),
		});

		return result ? toDomainEntity(Inquiry, result) : null;
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
		this.logger.debug("문의 목록 조회");

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where: params.where,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
				include: {
					space: true,
					createdBy: true,
					customer: {
						select: { id: true, name: true, email: true },
					},
					assignee: {
						select: { id: true, name: true, email: true },
					},
					tags: { include: { inquiry: { select: { id: true } } } },
				},
			}),
			this.txHost.tx.inquiry.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => toDomainEntity(Inquiry, item)),
			totalCount,
		};
	}

	/**
	 * 생성
	 */
	async create(
		data: AutoIdentityCreateInput<
			Prisma.InquiryUncheckedCreateInput,
			"inquiryId"
		>,
	): Promise<Inquiry> {
		this.logger.debug("문의 생성 중...");
		const result = await this.txHost.tx.inquiry.create({
			data,
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 문의의 기본 스레드 생성
	 */
	async createThread(
		data: AutoIdentityCreateInput<
			Prisma.InquiryThreadUncheckedCreateInput,
			"inquiryThreadId"
		>,
	): Promise<InquiryThread> {
		this.logger.debug(`문의 스레드 생성: ${data.inquiryId.toString()}`);
		const result = await this.txHost.tx.inquiryThread.create({
			data,
			include: { inquiry: true, createdBy: true },
		});

		return toDomainEntity(InquiryThread, result);
	}

	/**
	 * 문의의 기본 스레드 조회
	 */
	async findDefaultThreadByInquiryId(
		inquiryId: bigint,
	): Promise<InquiryThread | null> {
		this.logger.debug(`기본 스레드 조회: ${inquiryId}`);

		const result = await this.txHost.tx.inquiryThread.findFirst({
			where: {
				inquiryId,
			},
			include: { inquiry: true, createdBy: true },
			orderBy: { createdAt: "asc" },
		});

		return result ? toDomainEntity(InquiryThread, result) : null;
	}

	/**
	 * 스레드 ID로 조회
	 */
	async findThreadById(id: bigint): Promise<InquiryThread | null> {
		this.logger.debug(`스레드 조회: ${id.toString()}`);

		const result = await this.txHost.tx.inquiryThread.findUnique({
			where: { id },
			include: { inquiry: true, createdBy: true },
		});

		return result ? toDomainEntity(InquiryThread, result) : null;
	}

	/**
	 * 문의별 메시지 목록 조회
	 */
	async findMessagesByInquiryId(params: {
		inquiryId: bigint;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		this.logger.debug(`문의별 메시지 조회: ${params.inquiryId}`);

		const where: Prisma.InquiryMessageWhereInput = {
			inquiryId: params.inquiryId,
			isDeleted: false,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiryMessage.findMany({
				where,
				orderBy: [{ createdAt: "asc" }],
				skip: params.skip,
				take: params.take,
				include: {
					sender: {
						select: { id: true, name: true, email: true },
					},
					thread: {
						select: { id: true, title: true },
					},
					inquiry: { select: { id: true } },
					attachments: {
						where: { isDeleted: false },
					},
				},
			}),
			this.txHost.tx.inquiryMessage.count({ where }),
		]);

		return {
			items: items.map((item) => toDomainEntity(InquiryMessage, item)),
			totalCount,
		};
	}

	/**
	 * clientMessageId 중복 여부 확인
	 */
	async existsMessageByClientMessageId(
		threadId: bigint,
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
		data: AutoIdentityCreateInput<
			Prisma.InquiryMessageUncheckedCreateInput,
			"inquiryMessageId"
		>,
	): Promise<InquiryMessage> {
		this.logger.debug(`메시지 생성: ${data.inquiryId.toString()}`);
		const result = await this.txHost.tx.inquiryMessage.create({
			data,
			include: {
				sender: {
					select: { id: true, name: true, email: true },
				},
				thread: {
					select: { id: true, title: true },
				},
				inquiry: { select: { id: true } },
			},
		});

		return toDomainEntity(InquiryMessage, result);
	}

	/**
	 * 메시지 생성 후 스레드 집계 반영
	 */
	async touchThreadAfterMessage(
		threadId: bigint,
		preview: string,
	): Promise<InquiryThread> {
		this.logger.debug(`스레드 마지막 메시지 갱신: ${threadId}`);

		const result = await this.txHost.tx.inquiryThread.update({
			where: { id: threadId },
			data: {
				lastMessageAt: new Date(),
				lastMessagePreview: preview.slice(0, 100),
				messageCount: { increment: 1 },
			},
			include: { inquiry: true, createdBy: true },
		});

		return toDomainEntity(InquiryThread, result);
	}

	/**
	 * 참여자 목록 조회
	 */
	async findParticipantsByInquiryId(
		inquiryId: bigint,
	): Promise<InquiryParticipant[]> {
		this.logger.debug(`참여자 조회: ${inquiryId}`);

		const results = await this.txHost.tx.inquiryParticipant.findMany({
			where: {
				inquiryId,
				leftAt: null,
			},
			include: {
				inquiry: { select: { id: true } },
				thread: { select: { id: true } },
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		});

		return results.map((result) => toDomainEntity(InquiryParticipant, result));
	}

	async incrementParticipantUnreadByInquiryId(
		inquiryId: bigint,
		excludeUserId?: bigint,
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
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.InquiryUncheckedUpdateInput,
			"inquiryId"
		>,
	): Promise<Inquiry> {
		this.logger.debug(`업데이트 중: ${id.toString()}`);
		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data,
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 소프트 삭제
	 */
	async removeById(id: bigint): Promise<Inquiry> {
		this.logger.debug(`소프트 삭제 중: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { removedAt: new Date() },
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	// ============================================================================
	// 담당자 관련
	// ============================================================================

	/**
	 * 담당자 배정
	 */
	async updateAssigneeById(id: bigint, assigneeId: bigint): Promise<Inquiry> {
		this.logger.debug(`담당자 배정: ${id} -> ${assigneeId}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				assigneeId,
				status: "OPEN",
			},
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 담당자별 문의 목록 조회
	 */
	async findManyByAssigneeId(params: {
		assigneeId: bigint;
		where?: Prisma.InquiryWhereInput;
		orderBy?: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		this.logger.debug(`담당자별 문의 조회: ${params.assigneeId}`);

		const baseWhere: Prisma.InquiryWhereInput = {
			assigneeId: params.assigneeId,
			removedAt: null,
			...params.where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where: baseWhere,
				orderBy: params.orderBy ?? [
					{ priority: "desc" },
					{ createdAt: "desc" },
				],
				skip: params.skip,
				take: params.take,
				include: {
					space: true,
					createdBy: true,
					assignee: true,
					customer: {
						select: { id: true, name: true, email: true },
					},
					tags: { include: { inquiry: { select: { id: true } } } },
				},
			}),
			this.txHost.tx.inquiry.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => toDomainEntity(Inquiry, item)),
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
		customerId: bigint;
		where?: Prisma.InquiryWhereInput;
		orderBy?: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		this.logger.debug(`고객별 문의 조회: ${params.customerId}`);

		const baseWhere: Prisma.InquiryWhereInput = {
			customerId: params.customerId,
			removedAt: null,
			...params.where,
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.inquiry.findMany({
				where: baseWhere,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: {
					space: true,
					createdBy: true,
					customer: true,
					assignee: {
						select: { id: true, name: true, email: true },
					},
					tags: true,
				},
			}),
			this.txHost.tx.inquiry.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => toDomainEntity(Inquiry, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 상태 관련
	// ============================================================================

	/**
	 * 상태 업데이트
	 */
	async updateStatusById(id: bigint, status: InquiryStatus): Promise<Inquiry> {
		this.logger.debug(`상태 업데이트: ${id.toString()} -> ${status}`);

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
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 우선순위 업데이트
	 */
	async updatePriorityById(
		id: bigint,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		this.logger.debug(`우선순위 업데이트: ${id.toString()} -> ${priority}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { priority },
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	// ============================================================================
	// SLA 관련
	// ============================================================================

	/**
	 * SLA 초과 문의 목록 조회
	 */
	async findOverdueSla(params?: {
		spaceId?: bigint;
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
					space: true,
					createdBy: true,
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
			items: items.map((item) => toDomainEntity(Inquiry, item)),
			totalCount,
		};
	}

	// ============================================================================
	// 통계 관련
	// ============================================================================

	/**
	 * 상태별 문의 수 조회
	 */
	async countByStatus(spaceIds?: bigint[]): Promise<
		{
			status: InquiryStatus;
			count: number;
		}[]
	> {
		this.logger.debug(
			`상태별 문의 수 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const results = await this.txHost.tx.inquiry.groupBy({
			by: ["status"],
			where: {
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
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
	async countByCategory(spaceIds?: bigint[]): Promise<
		{
			category: InquiryCategory;
			count: number;
		}[]
	> {
		this.logger.debug(
			`카테고리별 문의 수 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const results = await this.txHost.tx.inquiry.groupBy({
			by: ["category"],
			where: {
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
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
	async countOverdue(spaceIds?: bigint[]): Promise<{
		responseOverdue: number;
		resolveOverdue: number;
		total: number;
	}> {
		this.logger.debug(
			`SLA 위반 문의 수 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const now = new Date();
		const baseWhere: Prisma.InquiryWhereInput = {
			...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
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
		id: bigint,
		sentiment: SentimentType,
		sentimentScore: number,
	): Promise<Inquiry> {
		this.logger.debug(`감정 분석 업데이트: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { sentiment, sentimentScore },
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	// ============================================================================
	// 읽음 상태 관련
	// ============================================================================

	/**
	 * 읽지 않은 메시지 수 초기화
	 */
	async resetUnreadCountById(id: bigint): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 초기화: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: { unreadCount: 0 },
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	async incrementUnreadCountById(id: bigint): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 증가: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				unreadCount: { increment: 1 },
			},
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	/**
	 * 마지막 메시지 시각 및 unreadCount 반영
	 */
	async recordMessageActivityById(id: bigint): Promise<Inquiry> {
		this.logger.debug(`문의 메시지 활동 반영: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				lastMessageAt: new Date(),
				unreadCount: { increment: 1 },
			},
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	// ============================================================================
	// 첫 응답 관련
	// ============================================================================

	/**
	 * 첫 응답 시간 기록
	 */
	async recordFirstResponseById(id: bigint): Promise<Inquiry> {
		this.logger.debug(`첫 응답 기록: ${id.toString()}`);

		const result = await this.txHost.tx.inquiry.update({
			where: { id },
			data: {
				firstResponseAt: new Date(),
			},
			include: this.includeInquiryRelations(),
		});

		return toDomainEntity(Inquiry, result);
	}

	private includeInquiryRelations() {
		return {
			space: true,
			createdBy: true,
			customer: true,
			assignee: true,
		} satisfies Prisma.InquiryInclude;
	}
}
