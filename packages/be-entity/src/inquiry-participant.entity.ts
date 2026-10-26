import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	BooleanFieldMetadata,
	DateFieldMetadata,
	EnumFieldMetadata,
	NumberFieldMetadata,
} from "@cocrepo/decorator/field";
import { InquiryParticipantRole } from "@cocrepo/enum";
import { InquiryParticipantSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryThread } from "./inquiry-thread.entity";
import type { User } from "./user.entity";

/**
 * 문의/스레드 참여자의 실시간 상태를 관리하는 엔티티
 *
 * 온라인/오프라인 상태, 타이핑 여부, 마지막 접속 시간 등을 추적하여
 * 실시간 채팅 경험을 제공합니다.
 */
@AbstractEntityFields()
export class InquiryParticipant extends InquiryParticipantSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare inquiryParticipantId: InquiryParticipantSchema["inquiryParticipantId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 문의 ID" })
	declare inquiryId: InquiryParticipantSchema["inquiryId"];
	@BigIntIdFieldMetadata({ description: "참여자 ID" })
	declare userId: InquiryParticipantSchema["userId"];
	@EnumFieldMetadata(() => InquiryParticipantRole, {
		description: "참여자 역할",
	})
	declare role: InquiryParticipantSchema["role"];
	@BooleanFieldMetadata({ description: "온라인 여부" })
	declare isOnline: InquiryParticipantSchema["isOnline"];
	@BooleanFieldMetadata({ description: "타이핑 중 여부" })
	declare isTyping: InquiryParticipantSchema["isTyping"];
	@NumberFieldMetadata({ description: "읽지 않은 메시지 수" })
	declare unreadCount: InquiryParticipantSchema["unreadCount"];
	@DateFieldMetadata({ description: "참여 일시" })
	declare joinedAt: InquiryParticipantSchema["joinedAt"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@BigIntIdFieldOptionalMetadata({
		nullable: true,
		description: "소속 스레드 ID",
	})
	declare threadId: InquiryParticipantSchema["threadId"];
	@DateFieldMetadata({ nullable: true, description: "마지막 접속 시간" })
	declare lastSeenAt: InquiryParticipantSchema["lastSeenAt"];
	@DateFieldMetadata({ nullable: true, description: "마지막 읽은 시간" })
	declare lastReadAt: InquiryParticipantSchema["lastReadAt"];
	@DateFieldMetadata({ nullable: true, description: "나간 일시" })
	declare leftAt: InquiryParticipantSchema["leftAt"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
	thread?: InquiryThread | null;
	user?: User;

	// ============================================================================
	// 역할 확인 메서드
	// ============================================================================

	/**
	 * 고객 여부
	 */
	isCustomer(): boolean {
		return this.role === "CUSTOMER";
	}

	/**
	 * 상담원 여부
	 */
	isAgent(): boolean {
		return this.role === "AGENT";
	}

	/**
	 * 감독관 여부
	 */
	isSupervisor(): boolean {
		return this.role === "SUPERVISOR";
	}

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 온라인 여부
	 */
	isOnlineStatus(): boolean {
		return this.isOnline;
	}

	/**
	 * 타이핑 중 여부
	 */
	isTypingStatus(): boolean {
		return this.isTyping;
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 온라인 상태로 변경
	 */
	goOnline(): void {
		this.isOnline = true;
		this.lastSeenAt = new Date();
	}

	/**
	 * 오프라인 상태로 변경
	 */
	goOffline(): void {
		this.isOnline = false;
		this.isTyping = false;
		this.lastSeenAt = new Date();
	}

	/**
	 * 타이핑 시작
	 */
	startTyping(): void {
		this.isTyping = true;
	}

	/**
	 * 타이핑 중지
	 */
	stopTyping(): void {
		this.isTyping = false;
	}

	/**
	 * 읽음 처리 (lastReadAt, unreadCount=0)
	 */
	markAsRead(): void {
		this.lastReadAt = new Date();
		this.unreadCount = 0;
	}

	/**
	 * 읽지 않은 메시지 증가
	 */
	incrementUnread(): void {
		this.unreadCount += 1;
	}

	/**
	 * 참여 종료
	 */
	leave(): void {
		this.leftAt = new Date();
		this.isOnline = false;
		this.isTyping = false;
	}
}
