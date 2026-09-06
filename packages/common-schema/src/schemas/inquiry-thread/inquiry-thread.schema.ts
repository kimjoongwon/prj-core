import { ThreadStatus } from "@cocrepo/enum";
import type { InquiryThread as PrismaInquiryThread } from "@cocrepo/prisma";
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
	implements PrismaInquiryThread
{
	inquiryThreadId!: PrismaInquiryThread["inquiryThreadId"];

	declare id: PrismaInquiryThread["id"];

	declare createdAt: PrismaInquiryThread["createdAt"];

	declare updatedAt: PrismaInquiryThread["updatedAt"];

	closedAt!: PrismaInquiryThread["closedAt"];

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: PrismaInquiryThread["inquiryId"];

	@StringValidation({ nullable: true, description: "스레드 제목" })
	title!: PrismaInquiryThread["title"];

	@EnumValidation(() => ThreadStatus, { description: "스레드 상태" })
	status!: PrismaInquiryThread["status"];

	@BigIntIdValidation({ description: "생성자 ID" })
	createdById!: PrismaInquiryThread["createdById"];

	@DateValidation({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: PrismaInquiryThread["lastMessageAt"];

	@StringValidation({ nullable: true, description: "마지막 메시지 미리보기" })
	lastMessagePreview!: PrismaInquiryThread["lastMessagePreview"];

	@NumberValidation({ description: "메시지 수" })
	messageCount!: PrismaInquiryThread["messageCount"];
}
