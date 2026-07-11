import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	type MessageContentType,
	type Prisma,
	type SenderType,
	type SentimentType,
} from "@cocrepo/prisma";
import type { ListInquiriesQueryInput } from "@cocrepo/input";
import {
	buildInquiryQueryOrderBy,
	buildInquiryQueryWhere,
	InquiriesRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { INQUIRY_CATEGORY_LABELS } from "./inquiry-category-labels";
import { INQUIRY_CHANNEL_LABELS } from "./inquiry-channel-labels";
import { INQUIRY_PRIORITY_LABELS } from "./inquiry-priority-labels";
import { INQUIRY_SOURCE_LABELS } from "./inquiry-source-labels";
import { INQUIRY_STATUS_LABELS } from "./inquiry-status-labels";
import { VALID_STATUS_TRANSITIONS } from "./valid-status-transitions";

@Injectable()
export class InquiryAggregate {
	private readonly logger = new Logger(InquiryAggregate.name);

	constructor(private readonly repository: InquiriesRepository) {}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * ID로 문의 조회
	 */
	async findById(id: string): Promise<Inquiry> {
		const inquiry = await this.repository.findById(id);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * ID로 상세 조회 (스레드, 메시지, 참여자 포함)
	 */
	async findByIdWithDetails(id: string, spaceIds?: string[]): Promise<Inquiry> {
		const inquiry =
			await this.repository.findByIdWithThreadsAndMessagesAndParticipants(
				id,
				spaceIds,
			);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * 문의 번호로 조회
	 */
	async findByNumber(inquiryNumber: string): Promise<Inquiry> {
		const inquiry = await this.repository.findByNumber(inquiryNumber);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * 목록 조회
	 */
	async list(
		params: ListInquiriesQueryInput,
	): Promise<{ items: Inquiry[]; totalCount: number }> {
		return this.repository.findMany({
			where: this.applySpaceScope(
				buildInquiryQueryWhere(params),
				params.spaceIds,
			),
			orderBy: buildInquiryQueryOrderBy(params),
			skip: params.skip,
			take: params.take,
		});
	}

	// ============================================================================
	// Create/Update Form Bootstrap
	// ============================================================================

	async getCreateFormBootstrap() {
		return {
			mode: "CREATE",
			defaultObject: {
				title: "",
				category: InquiryCategory.GENERAL,
				priority: InquiryPriority.NORMAL,
				content: "",
				channel: InquiryChannel.WEB,
				source: InquirySource.ONLINE,
				status: InquiryStatus.NEW,
			},
			options: this.buildFormOptions(),
			ui: this.buildUiPaths("CREATE"),
			fieldMeta: this.buildFieldMeta(),
		};
	}

	async getUpdateFormBootstrap(
		inquiryId: string,
		spaceIds?: string[],
	) {
		const inquiry = await this.findByIdWithDetails(inquiryId, spaceIds);

		return {
			mode: "UPDATE",
			defaultObject: {
				title: inquiry.title,
				category: inquiry.category,
				priority: inquiry.priority,
				content: "",
				channel: inquiry.channel,
				source: inquiry.source ?? InquirySource.ONLINE,
				status: inquiry.status,
			},
			options: this.buildFormOptions(),
			ui: this.buildUiPaths("UPDATE"),
			fieldMeta: this.buildFieldMeta(),
		};
	}

	// ============================================================================
	// 생성/수정/삭제
	// ============================================================================

	/**
	 * 문의 생성 (문의 번호 자동 생성)
	 */
	@Transactional()
	async create(
		data: Omit<Prisma.InquiryUncheckedCreateInput, "inquiryNumber">,
		actorUserId: string,
		initialContent?: string | null,
	): Promise<Inquiry> {
		this.logger.debug("문의 생성 중...");

		// 문의 번호 자동 생성 (YYYYMMDD-NNNN 형식)
		const inquiryNumber = this.generateInquiryNumber();

		const inquiry = await this.repository.create({
			...data,
			inquiryNumber,
		});

		const defaultThread = await this.repository.createThread({
			inquiryId: inquiry.id,
			createdBy: data.customerId ?? actorUserId,
			title: inquiry.title,
		});

		if (initialContent && initialContent.trim().length > 0) {
			await this.sendMessage({
				inquiryId: inquiry.id,
				actorUserId: data.customerId ?? actorUserId,
				threadId: defaultThread.id,
				content: initialContent,
				contentType: "TEXT",
				senderType: "USER",
			});
		}

		return this.findByIdWithDetails(inquiry.id);
	}

	/**
	 * 문의 수정
	 */
	async update(
		id: string,
		data: Prisma.InquiryUncheckedUpdateInput,
	): Promise<Inquiry> {
		this.logger.debug(`문의 수정: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.updateById(id, data);
	}

	/**
	 * 소프트 삭제
	 */
	async softDelete(id: string): Promise<Inquiry> {
		this.logger.debug(`문의 소프트 삭제: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.removeById(id);
	}

	// ============================================================================
	// 메시지/참여자
	// ============================================================================

	async listMessages(params: {
		inquiryId: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		await this.findById(params.inquiryId);
		return this.repository.findMessagesByInquiryId(params);
	}

	async sendMessage(params: {
		inquiryId: string;
		actorUserId: string;
		threadId?: string;
		content: string;
		contentType?: MessageContentType;
		senderType?: SenderType;
		clientMessageId?: string;
	}): Promise<InquiryMessage> {
		const inquiry = await this.findById(params.inquiryId);
		if (inquiry.status === "CLOSED") {
			throw new BadRequestException(
				"종료된 문의에는 메시지를 전송할 수 없습니다",
			);
		}

		const thread = params.threadId
			? await this.repository.findThreadById(params.threadId)
			: await this.repository.findDefaultThreadByInquiryId(params.inquiryId);

		if (!thread || thread.inquiryId !== params.inquiryId) {
			throw new NotFoundException("문의 스레드를 찾을 수 없습니다");
		}

		if (params.clientMessageId) {
			const exists = await this.repository.existsMessageByClientMessageId(
				thread.id,
				params.clientMessageId,
			);
			if (exists) {
				throw new BadRequestException(
					"이미 처리된 메시지입니다 (중복 clientMessageId)",
				);
			}
		}

		const senderType = params.senderType ?? "USER";
		const message = await this.repository.createMessage({
			inquiryId: params.inquiryId,
			threadId: thread.id,
			senderId: params.actorUserId,
			content: params.content,
			contentType: params.contentType ?? "TEXT",
			senderType,
			clientMessageId: params.clientMessageId,
		});

		await Promise.all([
			this.repository.touchThreadAfterMessage(thread.id, params.content),
			this.repository.recordMessageActivityById(params.inquiryId),
			this.repository.incrementParticipantUnreadByInquiryId(
				params.inquiryId,
				params.actorUserId,
			),
		]);

		if (inquiry.customerId !== params.actorUserId) {
			await this.repository.recordFirstResponseById(params.inquiryId);
		}

		return message;
	}

	async getParticipants(inquiryId: string): Promise<InquiryParticipant[]> {
		await this.findById(inquiryId);
		return this.repository.findParticipantsByInquiryId(inquiryId);
	}

	// ============================================================================
	// 담당자 배정
	// ============================================================================

	/**
	 * 담당자 배정
	 * - NEW 상태면 OPEN으로 변경
	 */
	async assignTo(id: string, assigneeId: string): Promise<Inquiry> {
		this.logger.debug(
			`담당자 배정: ${id.slice(-8)} -> ${assigneeId.slice(-8)}`,
		);

		const inquiry = await this.findById(id);

		// 이미 종료된 문의는 담당자 배정 불가
		if (inquiry.status === "CLOSED") {
			throw new BadRequestException(
				"종료된 문의는 담당자를 배정할 수 없습니다",
			);
		}

		return this.repository.updateAssigneeById(id, assigneeId);
	}

	// ============================================================================
	// 상태 관리
	// ============================================================================

	/**
	 * 상태 변경 (상태 머신 검증)
	 */
	async updateStatus(id: string, newStatus: InquiryStatus): Promise<Inquiry> {
		this.logger.debug(`상태 변경: ${id.slice(-8)} -> ${newStatus}`);

		const inquiry = await this.findById(id);

		// 상태 전이 검증
		this.validateStatusTransition(inquiry.status, newStatus);

		// RESOLVED로 변경 시 첫 응답 시간 기록 (아직 없으면)
		if (newStatus === "RESOLVED" && !inquiry.firstResponseAt) {
			await this.repository.recordFirstResponseById(id);
		}

		return this.repository.updateStatusById(id, newStatus);
	}

	/**
	 * 우선순위 변경
	 */
	async updatePriority(
		id: string,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		this.logger.debug(`우선순위 변경: ${id.slice(-8)} -> ${priority}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.updatePriorityById(id, priority);
	}

	// ============================================================================
	// 통계
	// ============================================================================

	/**
	 * 상태별/카테고리별 통계
	 */
	async getStats(spaceIds?: string[]) {
		this.logger.debug(
			`문의 통계 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const [byStatus, byCategory, overdue] = await Promise.all([
			this.repository.countByStatus(spaceIds),
			this.repository.countByCategory(spaceIds),
			this.repository.countOverdue(spaceIds),
		]);

		return {
			byStatus,
			byCategory,
			overdue,
		};
	}

	private applySpaceScope(
		where: Prisma.InquiryWhereInput,
		spaceIds?: string[],
	): Prisma.InquiryWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		return {
			...where,
			spaceId: { in: spaceIds },
		};
	}

	/**
	 * SLA 초과 문의 목록
	 */
	async getOverdueList(params?: {
		spaceId?: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		this.logger.debug("SLA 초과 문의 목록 조회");
		return this.repository.findOverdueSla(params);
	}

	// ============================================================================
	// AI 기능
	// ============================================================================

	/**
	 * 감정 분석
	 * 실제 구현은 별도 AI 서비스 또는 UseCase에서 처리
	 */
	async analyzeSentiment(inquiryId: string) {
		this.logger.debug(`감정 분석 요청: ${inquiryId.slice(-8)}`);

		// 존재 확인
		await this.findById(inquiryId);

		// TODO: 실제 AI 서비스 연동
		throw new BadRequestException("감정 분석 기능이 아직 구현되지 않았습니다");
	}

	/**
	 * 감정 분석 결과 업데이트 (AI 서비스에서 호출)
	 */
	async updateSentiment(
		id: string,
		sentiment: SentimentType,
		sentimentScore: number,
	): Promise<Inquiry> {
		this.logger.debug(`감정 분석 결과 업데이트: ${id.slice(-8)}`);
		return this.repository.updateSentimentById(id, sentiment, sentimentScore);
	}

	// ============================================================================
	// 읽음 상태
	// ============================================================================

	/**
	 * 읽지 않은 메시지 수 초기화
	 */
	async resetUnreadCount(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 초기화: ${id.slice(-8)}`);
		return this.repository.resetUnreadCountById(id);
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	async incrementUnreadCount(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 증가: ${id.slice(-8)}`);
		return this.repository.incrementUnreadCountById(id);
	}

	// ============================================================================
	// 첫 응답
	// ============================================================================

	/**
	 * 첫 응답 시간 기록
	 */
	async recordFirstResponse(id: string): Promise<Inquiry> {
		this.logger.debug(`첫 응답 기록: ${id.slice(-8)}`);
		return this.repository.recordFirstResponseById(id);
	}

	// ============================================================================
	// Private 메서드
	// ============================================================================

	private buildFormOptions() {
		return {
			category: Object.values(InquiryCategory).map((value) => ({
				value,
				label: INQUIRY_CATEGORY_LABELS[value],
			})),
			priority: Object.values(InquiryPriority).map((value) => ({
				value,
				label: INQUIRY_PRIORITY_LABELS[value],
			})),
			channel: Object.values(InquiryChannel).map((value) => ({
				value,
				label: INQUIRY_CHANNEL_LABELS[value],
			})),
			source: Object.values(InquirySource).map((value) => ({
				value,
				label: INQUIRY_SOURCE_LABELS[value],
			})),
			status: Object.values(InquiryStatus).map((value) => ({
				value,
				label: INQUIRY_STATUS_LABELS[value],
			})),
		};
	}

	private buildUiPaths(mode: "CREATE" | "UPDATE") {
		if (mode === "UPDATE") {
			return {
				readOnlyPaths: ["channel", "source"],
				hiddenPaths: ["content", "channel", "source"],
				disabledPaths: [],
			};
		}
		return {
			readOnlyPaths: [],
			hiddenPaths: [],
			disabledPaths: [],
		};
	}

	private buildFieldMeta(): Record<string, { label: string }> {
		return {
			title: {
				label: "문의 제목",
			},
			category: {
				label: "문의 카테고리",
			},
			priority: {
				label: "우선순위",
			},
			content: {
				label: "문의 내용",
			},
			channel: {
				label: "문의 채널",
			},
			source: {
				label: "접수 유형",
			},
		};
	}

	/**
	 * 상태 전이 검증
	 */
	private validateStatusTransition(
		currentStatus: InquiryStatus,
		newStatus: InquiryStatus,
	): void {
		const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

		if (!allowedTransitions.includes(newStatus)) {
			throw new BadRequestException(
				`${currentStatus} 상태에서 ${newStatus} 상태로 변경할 수 없습니다`,
			);
		}
	}

	/**
	 * 문의 번호 생성 (INQ-YYYYMMDD-NNNN 형식)
	 */
	private generateInquiryNumber(): string {
		const now = new Date();
		const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

		// 간단한 구현: 타임스탬프 기반 고유 번호
		// 실제로는 Repository에서 count 쿼리로 구현 권장
		const sequence = Date.now().toString().slice(-4);

		return `INQ-${datePart}-${sequence}`;
	}
}
