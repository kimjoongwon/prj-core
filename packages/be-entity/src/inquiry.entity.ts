import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	BooleanFieldMetadata,
	ClassField,
	DateFieldMetadata,
	EnumFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
} from "@cocrepo/decorator/field";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	SentimentType,
} from "@cocrepo/enum";
import { InquirySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { AIAgentLog } from "./ai-agent-log.entity";
import { InquiryMessage } from "./inquiry-message.entity";
import { InquiryParticipant } from "./inquiry-participant.entity";
import { InquiryTag } from "./inquiry-tag.entity";
import { InquiryThread } from "./inquiry-thread.entity";
import { SentimentAnalysis } from "./sentiment-analysis.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

/**
 * 옴니채널 고객 문의를 관리하는 핵심 엔티티
 *
 * 문의 접수, 상태 관리, 담당자 배정, SLA 추적, 실시간 채팅 지원 등의 기능을 제공합니다.
 * Space 기반 멀티테넌시를 지원합니다.
 */
@AbstractEntityFields()
export class Inquiry extends InquirySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) declare inquiryId: InquirySchema["inquiryId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 Space ID" })
	declare spaceId: InquirySchema["spaceId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: InquirySchema["createdById"];
	@StringFieldMetadata({ description: "문의 번호" })
	declare inquiryNumber: InquirySchema["inquiryNumber"];
	@StringFieldMetadata({ description: "문의 제목" })
	declare title: InquirySchema["title"];
	@EnumFieldMetadata(() => InquiryCategory, { description: "문의 카테고리" })
	declare category: InquirySchema["category"];
	@EnumFieldMetadata(() => InquiryChannel, { description: "문의 채널" })
	declare channel: InquirySchema["channel"];
	@EnumFieldMetadata(() => InquirySource, { description: "문의 접수 유형" })
	declare source: InquirySchema["source"];
	@EnumFieldMetadata(() => InquiryStatus, { description: "문의 상태" })
	declare status: InquirySchema["status"];
	@EnumFieldMetadata(() => InquiryPriority, { description: "문의 우선순위" })
	declare priority: InquirySchema["priority"];
	@BooleanFieldMetadata({ description: "SLA 응답 위반 여부" })
	declare isSlaResponseBreached: InquirySchema["isSlaResponseBreached"];
	@BooleanFieldMetadata({ description: "SLA 해결 위반 여부" })
	declare isSlaResolveBreached: InquirySchema["isSlaResolveBreached"];
	@BooleanFieldMetadata({ description: "AI 해결 시도 여부" })
	declare aiResolutionAttempted: InquirySchema["aiResolutionAttempted"];
	@BooleanFieldMetadata({ description: "AI 해결 여부" })
	declare aiResolved: InquirySchema["aiResolved"];
	@BooleanFieldMetadata({ description: "실시간 채팅 활성화 여부" })
	declare isRealtimeChat: InquirySchema["isRealtimeChat"];
	@NumberFieldMetadata({ description: "읽지 않은 메시지 수" })
	declare unreadCount: InquirySchema["unreadCount"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "고객 ID" })
	declare customerId: InquirySchema["customerId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "담당자 ID" })
	declare assigneeId: InquirySchema["assigneeId"];
	@DateFieldMetadata({ nullable: true, description: "첫 응답 일시" })
	declare firstResponseAt: InquirySchema["firstResponseAt"];
	@DateFieldMetadata({ nullable: true, description: "해결 일시" })
	declare resolvedAt: InquirySchema["resolvedAt"];
	@DateFieldMetadata({ nullable: true, description: "종료 일시" })
	declare closedAt: InquirySchema["closedAt"];
	@DateFieldMetadata({ nullable: true, description: "SLA 응답 기한" })
	declare slaResponseDue: InquirySchema["slaResponseDue"];
	@DateFieldMetadata({ nullable: true, description: "SLA 해결 기한" })
	declare slaResolveDue: InquirySchema["slaResolveDue"];
	@EnumFieldMetadata(() => SentimentType, {
		nullable: true,
		description: "감정 유형",
	})
	declare sentiment: InquirySchema["sentiment"];
	declare sentimentScore: InquirySchema["sentimentScore"];
	@DateFieldMetadata({ nullable: true, description: "마지막 메시지 일시" })
	declare lastMessageAt: InquirySchema["lastMessageAt"];
	declare metadata: InquirySchema["metadata"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => User, { required: false, nullable: true })
	customer?: User | null;
	@ClassField(() => User, { required: false, nullable: true })
	assignee?: User | null;
	@ClassField(() => InquiryThread, {
		isArray: true,
		description: "스레드 목록",
	})
	threads?: InquiryThread[];
	@ClassField(() => InquiryMessage, {
		required: false,
		each: true,
		isArray: true,
	})
	messages?: InquiryMessage[];
	@ClassField(() => InquiryParticipant, {
		isArray: true,
		description: "참여자 목록",
	})
	participants?: InquiryParticipant[];
	@ClassField(() => InquiryTag, { required: false, each: true, isArray: true })
	tags?: InquiryTag[];
	@ClassField(() => SentimentAnalysis, { required: false, nullable: true })
	sentimentAnalysis?: SentimentAnalysis | null;
	@ClassField(() => AIAgentLog, { required: false, each: true, isArray: true })
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
	assignTo(userId: bigint): void {
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
