import {
	BigIntIdFieldOptional,
	EnumFieldOptional,
	StringField,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { MessageContentType, SenderType } from "@cocrepo/prisma";

/**
 * 문의 메시지 생성 DTO
 */
export class CreateInquiryMessageDto {
	@BigIntIdFieldOptional({
		description: "스레드 ID (미지정 시 기본 스레드)",
	})
	threadId?: bigint;

	@StringField({
		minLength: 1,
		maxLength: 10000,
		description: "메시지 내용",
	})
	content: string;

	@EnumFieldOptional(() => MessageContentType, {
		description: "콘텐츠 유형 (기본값: TEXT)",
	})
	contentType?: MessageContentType;

	@EnumFieldOptional(() => SenderType, {
		description: "발신자 유형 (기본값: USER)",
	})
	senderType?: SenderType;

	@UUIDFieldOptional({
		description: "클라이언트 메시지 ID (중복 방지용)",
	})
	clientMessageId?: string;
}
