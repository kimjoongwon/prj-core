import type {
	InquiryMessage as InquiryMessageEntity,
	MessageContentType,
	Prisma,
	SenderType,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AIAgentLog } from "./ai-agent-log.entity";
import type { Inquiry } from "./inquiry.entity";
import type { InquiryAttachment } from "./inquiry-attachment.entity";
import type { InquiryThread } from "./inquiry-thread.entity";
import type { SentimentAnalysis } from "./sentiment-analysis.entity";
import type { User } from "./user.entity";

/**
 * 문의 스레드 내 개별 메시지를 관리하는 엔티티
 *
 * 실시간 채팅 지원을 위해 메시지 상태(전달, 읽음) 추적,
 * 타이핑 표시, AI/시스템 메시지 구분 등의 기능을 제공합니다.
 */
export class InquiryMessage
	extends AbstractEntity
	implements InquiryMessageEntity
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	threadId!: string;
	inquiryId!: string;
	senderType!: SenderType;
	content!: string;
	contentType!: MessageContentType;
	isEdited!: boolean;
	isDeleted!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	senderId!: string | null;
	clientMessageId!: string | null;
	deliveredAt!: Date | null;
	readAt!: Date | null;
	editedAt!: Date | null;
	metadata!: Prisma.JsonValue | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	thread?: InquiryThread;
	inquiry?: Inquiry;
	sender?: User | null;
	attachments?: InquiryAttachment[];
	sentimentAnalyses?: SentimentAnalysis[];
	sentimentAnalysis?: SentimentAnalysis | null;
	aiAgentLog?: AIAgentLog | null;

	// ============================================================================
	// 발신자 유형 확인 메서드
	// ============================================================================

	/**
	 * 사용자 메시지 여부
	 */
	isFromUser(): boolean {
		return this.senderType === "USER";
	}

	/**
	 * AI 메시지 여부
	 */
	isFromAI(): boolean {
		return this.senderType === "AI";
	}

	/**
	 * 시스템 메시지 여부
	 */
	isFromSystem(): boolean {
		return this.senderType === "SYSTEM";
	}

	// ============================================================================
	// 상태 확인 메서드
	// ============================================================================

	/**
	 * 전달 완료 여부
	 */
	isDelivered(): boolean {
		return this.deliveredAt !== null;
	}

	/**
	 * 읽음 여부
	 */
	isRead(): boolean {
		return this.readAt !== null;
	}

	// ============================================================================
	// 상태 변경 메서드
	// ============================================================================

	/**
	 * 전달 완료 처리
	 */
	markDelivered(): void {
		if (this.deliveredAt === null) {
			this.deliveredAt = new Date();
		}
	}

	/**
	 * 읽음 처리
	 */
	markRead(): void {
		if (this.readAt === null) {
			this.readAt = new Date();
		}
	}

	/**
	 * 내용 수정
	 */
	edit(newContent: string): void {
		this.content = newContent;
		this.isEdited = true;
		this.editedAt = new Date();
	}

	/**
	 * 소프트 삭제
	 */
	softDelete(): void {
		this.isDeleted = true;
	}
}
