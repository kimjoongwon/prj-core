import {
	BigIntIdFieldMetadata,
	ClassField,
	DateFieldMetadata,
	EnumFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
} from "@cocrepo/decorator/field";
import { ThreadStatus } from "@cocrepo/enum";
import { InquiryThreadSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Inquiry } from "./inquiry.entity";
import { InquiryMessage } from "./inquiry-message.entity";
import { InquiryParticipant } from "./inquiry-participant.entity";
import { User } from "./user.entity";

/**
 * 문의 내 대화 스레드를 관리하는 엔티티
 *
 * 하나의 문의에 여러 스레드가 존재할 수 있으며,
 * 각 스레드는 독립적인 대화 흐름을 가집니다.
 */
@AbstractEntityFields()
export class InquiryThread extends InquiryThreadSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare inquiryThreadId: InquiryThreadSchema["inquiryThreadId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 문의 ID" })
	declare inquiryId: InquiryThreadSchema["inquiryId"];
	@EnumFieldMetadata(() => ThreadStatus, { description: "스레드 상태" })
	declare status: InquiryThreadSchema["status"];
	@BigIntIdFieldMetadata({ description: "생성자 ID" })
	declare createdById: InquiryThreadSchema["createdById"];
	@NumberFieldMetadata({ description: "메시지 수" })
	declare messageCount: InquiryThreadSchema["messageCount"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldMetadata({ nullable: true, description: "스레드 제목" })
	declare title: InquiryThreadSchema["title"];
	@DateFieldMetadata({ nullable: true, description: "마지막 메시지 일시" })
	declare lastMessageAt: InquiryThreadSchema["lastMessageAt"];
	@StringFieldMetadata({
		nullable: true,
		description: "마지막 메시지 미리보기",
	})
	declare lastMessagePreview: InquiryThreadSchema["lastMessagePreview"];
	declare closedAt: InquiryThreadSchema["closedAt"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	@ClassField(() => Inquiry, { required: false }) inquiry?: Inquiry;
	@ClassField(() => User, { required: false }) createdBy?: User;
	@ClassField(() => InquiryMessage, {
		required: false,
		each: true,
		isArray: true,
	})
	messages?: InquiryMessage[];
	@ClassField(() => InquiryParticipant, {
		required: false,
		each: true,
		isArray: true,
	})
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
