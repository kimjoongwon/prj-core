import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	BooleanFieldMetadata,
	ClassField,
	DateFieldMetadata,
	EnumFieldMetadata,
	StringFieldMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { MessageContentType, SenderType } from "@cocrepo/enum";
import { InquiryMessageSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { AIAgentLog } from "./ai-agent-log.entity";
import { Inquiry } from "./inquiry.entity";
import { InquiryAttachment } from "./inquiry-attachment.entity";
import { InquiryThread } from "./inquiry-thread.entity";
import { SentimentAnalysis } from "./sentiment-analysis.entity";
import { User } from "./user.entity";

/**
 * 문의 스레드 내 개별 메시지를 관리하는 엔티티
 *
 * 실시간 채팅 지원을 위해 메시지 상태(전달, 읽음) 추적,
 * 타이핑 표시, AI/시스템 메시지 구분 등의 기능을 제공합니다.
 */
@AbstractEntityFields()
export class InquiryMessage extends InquiryMessageSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare inquiryMessageId: InquiryMessageSchema["inquiryMessageId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 스레드 ID" })
	declare threadId: InquiryMessageSchema["threadId"];
	@BigIntIdFieldMetadata({ description: "소속 문의 ID" })
	declare inquiryId: InquiryMessageSchema["inquiryId"];
	@EnumFieldMetadata(() => SenderType, { description: "발신자 유형" })
	declare senderType: InquiryMessageSchema["senderType"];
	@StringFieldMetadata({ description: "메시지 내용" })
	declare content: InquiryMessageSchema["content"];
	@EnumFieldMetadata(() => MessageContentType, { description: "콘텐츠 유형" })
	declare contentType: InquiryMessageSchema["contentType"];
	@BooleanFieldMetadata({ description: "수정 여부" })
	declare isEdited: InquiryMessageSchema["isEdited"];
	@BooleanFieldMetadata({ description: "삭제 여부" })
	declare isDeleted: InquiryMessageSchema["isDeleted"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "발신자 ID" })
	declare senderId: InquiryMessageSchema["senderId"];
	@UUIDFieldOptionalMetadata({
		nullable: true,
		description: "클라이언트 메시지 ID",
	})
	declare clientMessageId: InquiryMessageSchema["clientMessageId"];
	@DateFieldMetadata({ nullable: true, description: "전달 완료 시간" })
	declare deliveredAt: InquiryMessageSchema["deliveredAt"];
	@DateFieldMetadata({ nullable: true, description: "읽음 확인 시간" })
	declare readAt: InquiryMessageSchema["readAt"];
	@DateFieldMetadata({ nullable: true, description: "수정 일시" })
	declare editedAt: InquiryMessageSchema["editedAt"];
	declare metadata: InquiryMessageSchema["metadata"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	@ClassField(() => InquiryThread, { required: false }) thread?: InquiryThread;
	@ClassField(() => Inquiry, { required: false }) inquiry?: Inquiry;
	@ClassField(() => User, { required: false, nullable: true })
	sender?: User | null;
	@ClassField(() => InquiryAttachment, {
		isArray: true,
		required: false,
		description: "첨부파일 목록",
	})
	attachments?: InquiryAttachment[];
	@ClassField(() => SentimentAnalysis, {
		required: false,
		each: true,
		isArray: true,
	})
	sentimentAnalyses?: SentimentAnalysis[];
	@ClassField(() => SentimentAnalysis, { required: false, nullable: true })
	sentimentAnalysis?: SentimentAnalysis | null;
	@ClassField(() => AIAgentLog, { required: false, nullable: true })
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
