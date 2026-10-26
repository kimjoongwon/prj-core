import { StringField, UUIDFieldOptional } from "@cocrepo/decorator/field";
import { InquiryMessage } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 문의 메시지 생성 DTO
 */
export class CreateInquiryMessageDto extends PartialType(
	PickType(InquiryMessage, ["threadId", "contentType", "senderType"] as const),
	{ skipNullProperties: false },
) {
	@StringField({
		minLength: 1,
		maxLength: 10000,
		description: "메시지 내용",
	})
	content: string;

	@UUIDFieldOptional({
		description: "클라이언트 메시지 ID (중복 방지용)",
	})
	clientMessageId?: string;
}
