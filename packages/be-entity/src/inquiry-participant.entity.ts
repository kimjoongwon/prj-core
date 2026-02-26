import type {
	InquiryParticipant as InquiryParticipantEntity,
	InquiryParticipantRole,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryThread } from "./inquiry-thread.entity";
import type { User } from "./user.entity";

/**
 * 문의/스레드 참여자의 실시간 상태를 관리하는 엔티티
 *
 * 온라인/오프라인 상태, 타이핑 여부, 마지막 접속 시간 등을 추적하여
 * 실시간 채팅 경험을 제공합니다.
 */
export class InquiryParticipant extends AbstractEntity implements InquiryParticipantEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	inquiryId!: string;
	userId!: string;
	role!: InquiryParticipantRole;
	isOnline!: boolean;
	isTyping!: boolean;
	unreadCount!: number;
	joinedAt!: Date;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	threadId!: string | null;
	lastSeenAt!: Date | null;
	lastReadAt!: Date | null;
	leftAt!: Date | null;

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
