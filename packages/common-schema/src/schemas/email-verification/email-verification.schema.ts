import { EmailVerificationStatus } from "@cocrepo/enum";
import type { EmailVerification as PrismaEmailVerification } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	DateValidation,
	DateValidationOptional,
	EnumValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** EmailVerification의 DB 필드 타입과 공통 검증입니다. */
export class EmailVerificationSchema
	extends AbstractSchema
	implements PrismaEmailVerification
{
	emailVerificationId!: PrismaEmailVerification["emailVerificationId"];

	@StringValidation({ description: "이메일" })
	email!: PrismaEmailVerification["email"];

	@StringValidation({ description: "이름" })
	name!: PrismaEmailVerification["name"];

	nickname!: PrismaEmailVerification["nickname"];

	@StringValidation({ description: "전화번호" })
	phone!: PrismaEmailVerification["phone"];

	@StringValidation({ description: "주소" })
	address!: PrismaEmailVerification["address"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaEmailVerification["spaceId"];

	passwordHash!: PrismaEmailVerification["passwordHash"];

	tokenHash!: PrismaEmailVerification["tokenHash"];

	@EnumValidation(() => EmailVerificationStatus, { description: "상태" })
	status!: PrismaEmailVerification["status"];

	@DateValidation({ description: "만료 시각" })
	expiresAt!: PrismaEmailVerification["expiresAt"];

	@DateValidationOptional({ nullable: true, description: "인증 시각" })
	verifiedAt!: PrismaEmailVerification["verifiedAt"];

	@DateValidationOptional({ nullable: true, description: "마지막 발송 시각" })
	lastSentAt!: PrismaEmailVerification["lastSentAt"];

	@NumberValidation({ description: "발송 횟수", min: 0 })
	sendCount!: PrismaEmailVerification["sendCount"];

	@StringValidationOptional({ nullable: true, description: "마지막 발송 상태" })
	lastSendStatus!: PrismaEmailVerification["lastSendStatus"];

	@StringValidationOptional({ nullable: true, description: "마지막 발송 오류" })
	lastSendError!: PrismaEmailVerification["lastSendError"];

	@BigIntIdValidationOptional({
		nullable: true,
		description: "인증 완료 사용자 ID",
	})
	verifiedUserId!: PrismaEmailVerification["verifiedUserId"];
}
