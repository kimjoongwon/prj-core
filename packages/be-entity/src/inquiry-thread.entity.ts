import type {
	InquiryThread as InquiryThreadEntity,
	ThreadStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryMessage } from "./inquiry-message.entity";
import type { InquiryParticipant } from "./inquiry-participant.entity";
import type { User } from "./user.entity";

/**
 * 문의 내 대화 스레드를 관리하는 엔티티
 *
 * 하나의 문의에 여러 스레드가 존재할 수 있으며,
 * 각 스레드는 독립적인 대화 흐름을 가집니다.
 */
export class InquiryThread
	extends AbstractEntity
	implements InquiryThreadEntity
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	inquiryId!: string;
	status!: ThreadStatus;
	createdById!: string;
	messageCount!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	title!: string | null;
	lastMessageAt!: Date | null;
	lastMessagePreview!: string | null;
	closedAt!: Date | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
	createdBy?: User;
	messages?: InquiryMessage[];
	participants?: InquiryParticipant[];

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 활성 상태 여부
	 */
	isActive(): boolean {
		return this.status === "ACTIVE";
	}

	/**
	 * 해결됨 여부
	 */
	isResolved(): boolean {
		return this.status === "RESOLVED";
	}

	/**
	 * 종료됨 여부
	 */
	isClosed(): boolean {
		return this.status === "CLOSED";
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 해결 처리
	 */
	markResolved(): void {
		this.status = "RESOLVED";
	}

	/**
	 * 종료 처리
	 */
	markClosed(): void {
		this.status = "CLOSED";
		this.closedAt = new Date();
	}

	/**
	 * 메시지 수 증가
	 */
	incrementMessageCount(): void {
		this.messageCount += 1;
	}

	/**
	 * 마지막 메시지 정보 업데이트
	 */
	updateLastMessage(preview: string): void {
		this.lastMessageAt = new Date();
		// 미리보기는 100자로 제한
		this.lastMessagePreview = preview.slice(0, 100);
	}
}
