import { MessageContentType, SenderType } from "@cocrepo/enum";
import type { InquiryMessage as PrismaInquiryMessage } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	BooleanValidation,
	DateValidation,
	EnumValidation,
	StringValidation,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** InquiryMessage의 DB 필드 타입과 공통 검증입니다. */
export class InquiryMessageSchema
	extends PickSchemaType(AbstractSchema, ["id", "createdAt"] as const)
	implements PrismaInquiryMessage
{
	inquiryMessageId!: PrismaInquiryMessage["inquiryMessageId"];

	declare id: PrismaInquiryMessage["id"];

	declare createdAt: PrismaInquiryMessage["createdAt"];

	@BigIntIdValidation({ description: "소속 스레드 ID" })
	threadId!: PrismaInquiryMessage["threadId"];

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: PrismaInquiryMessage["inquiryId"];

	@BigIntIdValidationOptional({ nullable: true, description: "발신자 ID" })
	senderId!: PrismaInquiryMessage["senderId"];

	@EnumValidation(() => SenderType, { description: "발신자 유형" })
	senderType!: PrismaInquiryMessage["senderType"];

	@UUIDValidationOptional({
		nullable: true,
		description: "클라이언트 메시지 ID",
	})
	clientMessageId!: PrismaInquiryMessage["clientMessageId"];

	@StringValidation({ description: "메시지 내용" })
	content!: PrismaInquiryMessage["content"];

	@EnumValidation(() => MessageContentType, { description: "콘텐츠 유형" })
	contentType!: PrismaInquiryMessage["contentType"];

	@DateValidation({ nullable: true, description: "전달 완료 시간" })
	deliveredAt!: PrismaInquiryMessage["deliveredAt"];

	@DateValidation({ nullable: true, description: "읽음 확인 시간" })
	readAt!: PrismaInquiryMessage["readAt"];

	@DateValidation({ nullable: true, description: "수정 일시" })
	editedAt!: PrismaInquiryMessage["editedAt"];

	@BooleanValidation({ description: "수정 여부" })
	isEdited!: PrismaInquiryMessage["isEdited"];

	@BooleanValidation({ description: "삭제 여부" })
	isDeleted!: PrismaInquiryMessage["isDeleted"];

	metadata!: PrismaInquiryMessage["metadata"];
}
