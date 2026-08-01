import type {
	InquiryCategory,
	InquiryChannel,
	Inquiry as InquiryEntity,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	Prisma,
	SentimentType,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AIAgentLog } from "./ai-agent-log.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { InquiryMessage } from "./inquiry-message.entity";
import type { InquiryParticipant } from "./inquiry-participant.entity";
import type { InquiryTag } from "./inquiry-tag.entity";
import type { InquiryThread } from "./inquiry-thread.entity";
import type { SentimentAnalysis } from "./sentiment-analysis.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

/**
 * 옴니채널 고객 문의를 관리하는 핵심 엔티티
 *
 * 문의 접수, 상태 관리, 담당자 배정, SLA 추적, 실시간 채팅 지원 등의 기능을 제공합니다.
 * Space 기반 멀티테넌시를 지원합니다.
 */
export class Inquiry
	extends AbstractEntity
	implements DomainEntityModel<InquiryEntity>
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	createdById!: string | null;
	inquiryNumber!: string;
	title!: string;
	category!: InquiryCategory;
	channel!: InquiryChannel;
	source!: InquirySource;
	status!: InquiryStatus;
	priority!: InquiryPriority;
	isSlaResponseBreached!: boolean;
	isSlaResolveBreached!: boolean;
	aiResolutionAttempted!: boolean;
	aiResolved!: boolean;
	isRealtimeChat!: boolean;
	unreadCount!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	customerId!: string | null;
	assigneeId!: string | null;
	firstResponseAt!: Date | null;
	resolvedAt!: Date | null;
	closedAt!: Date | null;
	slaResponseDue!: Date | null;
	slaResolveDue!: Date | null;
	sentiment!: SentimentType | null;
	sentimentScore!: number | null;
	lastMessageAt!: Date | null;
	metadata!: Prisma.JsonValue | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	createdBy?: User | null;
	customer?: User | null;
	assignee?: User | null;
	threads?: InquiryThread[];
	messages?: InquiryMessage[];
	participants?: InquiryParticipant[];
	tags?: InquiryTag[];
	sentimentAnalysis?: SentimentAnalysis | null;
	aiAgentLogs?: AIAgentLog[];

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 신규 문의 여부 확인
	 */
	isNew(): boolean {
		return this.status === "NEW";
	}

	/**
	 * 열림 상태 여부 확인
	 */
	isOpen(): boolean {
		return this.status === "OPEN";
	}

	/**
	 * 처리 중 여부 확인
	 */
	isInProgress(): boolean {
		return this.status === "IN_PROGRESS";
	}

	/**
	 * 해결됨 여부 확인
	 */
	isResolved(): boolean {
		return this.status === "RESOLVED";
	}

	/**
	 * 종료됨 여부 확인
	 */
	isClosed(): boolean {
		return this.status === "CLOSED";
	}

	/**
	 * 에스컬레이션 여부 확인
	 */
	isEscalated(): boolean {
		return this.status === "ESCALATED";
	}

	/**
	 * 담당자 배정 여부 확인
	 */
	isAssigned(): boolean {
		return this.assigneeId !== null;
	}

	/**
	 * SLA 위반 여부 확인 (응답 또는 해결)
	 */
	isSlaBreached(): boolean {
		return this.isSlaResponseBreached || this.isSlaResolveBreached;
	}

	/**
	 * 실시간 채팅 활성화 여부
	 */
	isRealtimeChatEnabled(): boolean {
		return this.isRealtimeChat || this.channel === "CHAT";
	}

	/**
	 * 재오픈 가능 여부 확인
	 */
	canReopen(): boolean {
		// CLOSED 상태는 재오픈 불가
		if (this.isClosed()) return false;
		// RESOLVED 상태에서만 재오픈 가능
		return this.isResolved();
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 담당자 배정
	 */
	assignTo(userId: string): void {
		this.assigneeId = userId;
		if (this.isNew()) {
			this.status = "OPEN";
		}
	}

	/**
	 * 처리 시작
	 */
	startProgress(): void {
		if (this.isOpen()) {
			this.status = "IN_PROGRESS";
		}
	}

	/**
	 * 해결 완료 처리
	 */
	markResolved(): void {
		this.status = "RESOLVED";
		this.resolvedAt = new Date();
	}

	/**
	 * 종료 처리
	 */
	markClosed(): void {
		if (!this.isResolved()) {
			throw new Error("RESOLVED 상태에서만 종료할 수 있습니다.");
		}
		this.status = "CLOSED";
		this.closedAt = new Date();
	}

	/**
	 * 에스컬레이션
	 */
	escalate(): void {
		this.status = "ESCALATED";
	}

	/**
	 * 첫 응답 기록
	 */
	recordFirstResponse(): void {
		if (this.firstResponseAt === null) {
			this.firstResponseAt = new Date();
		}
	}

	/**
	 * SLA 상태 업데이트
	 */
	updateSlaStatus(): void {
		const now = new Date();

		if (this.slaResponseDue && !this.firstResponseAt) {
			this.isSlaResponseBreached = now > this.slaResponseDue;
		}

		if (this.slaResolveDue && !this.resolvedAt) {
			this.isSlaResolveBreached = now > this.slaResolveDue;
		}
	}

	/**
	 * 실시간 채팅 활성화
	 */
	enableRealtimeChat(): void {
		this.isRealtimeChat = true;
	}

	/**
	 * 마지막 메시지 시간 업데이트
	 */
	updateLastMessage(): void {
		this.lastMessageAt = new Date();
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	incrementUnreadCount(): void {
		this.unreadCount += 1;
	}

	/**
	 * 읽지 않은 메시지 수 초기화
	 */
	resetUnreadCount(): void {
		this.unreadCount = 0;
	}
}
