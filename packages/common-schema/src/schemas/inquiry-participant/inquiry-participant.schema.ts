import { InquiryParticipantRole } from "@cocrepo/enum";
import type { InquiryParticipant as PrismaInquiryParticipant } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	BooleanValidation,
	DateValidation,
	EnumValidation,
	NumberValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** InquiryParticipant의 DB 필드 타입과 공통 검증입니다. */
export class InquiryParticipantSchema
	extends PickSchemaType(AbstractSchema, ["id"] as const)
	implements PrismaInquiryParticipant
{
	inquiryParticipantId!: PrismaInquiryParticipant["inquiryParticipantId"];

	declare id: PrismaInquiryParticipant["id"];

	@DateValidation({ description: "참여 일시" })
	joinedAt!: PrismaInquiryParticipant["joinedAt"];

	@DateValidation({ nullable: true, description: "나간 일시" })
	leftAt!: PrismaInquiryParticipant["leftAt"];

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: PrismaInquiryParticipant["inquiryId"];

	@BigIntIdValidationOptional({ nullable: true, description: "소속 스레드 ID" })
	threadId!: PrismaInquiryParticipant["threadId"];

	@BigIntIdValidation({ description: "참여자 ID" })
	userId!: PrismaInquiryParticipant["userId"];

	@EnumValidation(() => InquiryParticipantRole, { description: "참여자 역할" })
	role!: PrismaInquiryParticipant["role"];

	@BooleanValidation({ description: "온라인 여부" })
	isOnline!: PrismaInquiryParticipant["isOnline"];

	@BooleanValidation({ description: "타이핑 중 여부" })
	isTyping!: PrismaInquiryParticipant["isTyping"];

	@DateValidation({ nullable: true, description: "마지막 접속 시간" })
	lastSeenAt!: PrismaInquiryParticipant["lastSeenAt"];

	@DateValidation({ nullable: true, description: "마지막 읽은 시간" })
	lastReadAt!: PrismaInquiryParticipant["lastReadAt"];

	@NumberValidation({ description: "읽지 않은 메시지 수" })
	unreadCount!: PrismaInquiryParticipant["unreadCount"];
}
