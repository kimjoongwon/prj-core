import { Inquiry } from "@cocrepo/entity";
import type {
	InquiryCategory,
	InquiryPriority,
	InquiryStatus,
	Prisma,
	SentimentType,
} from "@cocrepo/prisma";
import { InquiriesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

/**
 * 상태 전이 규칙 (상태 머신)
 *
 * NEW → OPEN, IN_PROGRESS, ESCALATED
 * OPEN → IN_PROGRESS, WAITING_CUSTOMER, RESOLVED, ESCALATED
 * IN_PROGRESS → WAITING_CUSTOMER, RESOLVED, ESCALATED
 * WAITING_CUSTOMER → IN_PROGRESS, RESOLVED, ESCALATED
 * RESOLVED → CLOSED, IN_PROGRESS (재오픈)
 * CLOSED → (종료 상태, 변경 불가)
 * ESCALATED → IN_PROGRESS, RESOLVED
 */
const VALID_STATUS_TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
	NEW: ["OPEN", "IN_PROGRESS", "ESCALATED"],
	OPEN: ["IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "ESCALATED"],
	IN_PROGRESS: ["WAITING_CUSTOMER", "RESOLVED", "ESCALATED"],
	WAITING_CUSTOMER: ["IN_PROGRESS", "RESOLVED", "ESCALATED"],
	RESOLVED: ["CLOSED", "IN_PROGRESS"], // 재오픈 가능
	CLOSED: [], // 종료 상태
	ESCALATED: ["IN_PROGRESS", "RESOLVED"],
};

/**
 * 문의 통계
 */
export interface InquiryStats {
	byStatus: { status: InquiryStatus; count: number }[];
	byCategory: { category: InquiryCategory; count: number }[];
	overdue: {
		responseOverdue: number;
		resolveOverdue: number;
		total: number;
	};
}

/**
 * AI 초안 생성 결과 (인터페이스)
 */
export interface AIDraftResult {
	draftId: string;
	content: string;
	confidence: number;
	suggestedCategory?: InquiryCategory;
	suggestedPriority?: InquiryPriority;
}

/**
 * 감정 분석 결과 (인터페이스)
 */
export interface SentimentAnalysisResult {
	sentiment: SentimentType;
	score: number;
	confidence: number;
	keywords?: string[];
}

@Injectable()
export class InquiriesService {
	private readonly logger = new Logger(InquiriesService.name);

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
	async findByIdWithDetails(id: string): Promise<Inquiry> {
		const inquiry =
			await this.repository.findByIdWithThreadsAndMessagesAndParticipants(id);
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
	async list(params: {
		where: Prisma.InquiryWhereInput;
		orderBy: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		return this.repository.findMany(params);
	}

	// ============================================================================
	// 생성/수정/삭제
	// ============================================================================

	/**
	 * 문의 생성 (문의 번호 자동 생성)
	 */
	async create(
		data: Omit<Prisma.InquiryUncheckedCreateInput, "inquiryNumber">,
	): Promise<Inquiry> {
		this.logger.debug("문의 생성 중...");

		// 문의 번호 자동 생성 (YYYYMMDD-NNNN 형식)
		const inquiryNumber = this.generateInquiryNumber();

		return this.repository.create({
			...data,
			inquiryNumber,
		});
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
	async getStats(spaceId: string): Promise<InquiryStats> {
		this.logger.debug(`문의 통계 조회: ${spaceId.slice(-8)}`);

		const [byStatus, byCategory, overdue] = await Promise.all([
			this.repository.countByStatus(spaceId),
			this.repository.countByCategory(spaceId),
			this.repository.countOverdue(spaceId),
		]);

		return {
			byStatus,
			byCategory,
			overdue,
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
	// AI 기능 (인터페이스만 제공)
	// ============================================================================

	/**
	 * AI 초안 생성
	 * 실제 구현은 별도 AI 서비스 또는 Facade에서 처리
	 */
	async generateAIDraft(inquiryId: string): Promise<AIDraftResult> {
		this.logger.debug(`AI 초안 생성 요청: ${inquiryId.slice(-8)}`);

		// 존재 확인
		await this.findById(inquiryId);

		// TODO: 실제 AI 서비스 연동
		throw new BadRequestException(
			"AI 초안 생성 기능이 아직 구현되지 않았습니다",
		);
	}

	/**
	 * 감정 분석
	 * 실제 구현은 별도 AI 서비스 또는 Facade에서 처리
	 */
	async analyzeSentiment(inquiryId: string): Promise<SentimentAnalysisResult> {
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
