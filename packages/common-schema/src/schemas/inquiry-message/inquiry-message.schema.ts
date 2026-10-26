import type { JsonValue } from "@cocrepo/type";
import { MessageContentType, SenderType } from "@cocrepo/enum";
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
{
	inquiryMessageId!: string;

	declare id: bigint;

	declare createdAt: Date;

	@BigIntIdValidation({ description: "소속 스레드 ID" })
	threadId!: bigint;

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "발신자 ID" })
	senderId!: bigint | null;

	@EnumValidation(() => SenderType, { description: "발신자 유형" })
	senderType!: SenderType;

	@UUIDValidationOptional({
		nullable: true,
		description: "클라이언트 메시지 ID",
	})
	clientMessageId!: string | null;

	@StringValidation({ description: "메시지 내용" })
	content!: string;

	@EnumValidation(() => MessageContentType, { description: "콘텐츠 유형" })
	contentType!: MessageContentType;

	@DateValidation({ nullable: true, description: "전달 완료 시간" })
	deliveredAt!: Date | null;

	@DateValidation({ nullable: true, description: "읽음 확인 시간" })
	readAt!: Date | null;

	@DateValidation({ nullable: true, description: "수정 일시" })
	editedAt!: Date | null;

	@BooleanValidation({ description: "수정 여부" })
	isEdited!: boolean;

	@BooleanValidation({ description: "삭제 여부" })
	isDeleted!: boolean;

	metadata!: JsonValue;
}
