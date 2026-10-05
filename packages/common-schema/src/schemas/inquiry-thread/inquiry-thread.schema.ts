import { ThreadStatus } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	DateValidation,
	EnumValidation,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** InquiryThread의 DB 필드 타입과 공통 검증입니다. */
export class InquiryThreadSchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
{
	inquiryThreadId!: string;

	declare id: bigint;

	declare createdAt: Date;

	declare updatedAt: Date | null;

	closedAt!: Date | null;

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: bigint;

	@StringValidation({ nullable: true, description: "스레드 제목" })
	title!: string | null;

	@EnumValidation(() => ThreadStatus, { description: "스레드 상태" })
	status!: ThreadStatus;

	@BigIntIdValidation({ description: "생성자 ID" })
	createdById!: bigint;

	@DateValidation({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: Date | null;

	@StringValidation({ nullable: true, description: "마지막 메시지 미리보기" })
	lastMessagePreview!: string | null;

	@NumberValidation({ description: "메시지 수" })
	messageCount!: number;
}
