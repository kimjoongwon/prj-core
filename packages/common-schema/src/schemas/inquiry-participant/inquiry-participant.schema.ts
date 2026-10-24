import { InquiryParticipantRole } from "@cocrepo/enum";
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
	extends PickSchemaType(AbstractSchema, ["seq"] as const)
{
	id!: string;

	declare seq: bigint;

	@DateValidation({ description: "참여 일시" })
	joinedAt!: Date;

	@DateValidation({ nullable: true, description: "나간 일시" })
	leftAt!: Date | null;

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquirySeq!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "소속 스레드 ID" })
	threadSeq!: bigint | null;

	@BigIntIdValidation({ description: "참여자 ID" })
	userSeq!: bigint;

	@EnumValidation(() => InquiryParticipantRole, { description: "참여자 역할" })
	role!: InquiryParticipantRole;

	@BooleanValidation({ description: "온라인 여부" })
	isOnline!: boolean;

	@BooleanValidation({ description: "타이핑 중 여부" })
	isTyping!: boolean;

	@DateValidation({ nullable: true, description: "마지막 접속 시간" })
	lastSeenAt!: Date | null;

	@DateValidation({ nullable: true, description: "마지막 읽은 시간" })
	lastReadAt!: Date | null;

	@NumberValidation({ description: "읽지 않은 메시지 수" })
	unreadCount!: number;
}
