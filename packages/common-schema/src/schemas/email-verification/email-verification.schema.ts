import { EmailVerificationStatus } from "@cocrepo/enum";
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
{
	emailVerificationId!: string;

	@StringValidation({ description: "이메일" })
	email!: string;

	@StringValidation({ description: "이름" })
	name!: string;

	nickname!: string;

	@StringValidation({ description: "전화번호" })
	phone!: string;

	@StringValidation({ description: "주소" })
	address!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	passwordHash!: string;

	tokenHash!: string;

	@EnumValidation(() => EmailVerificationStatus, { description: "상태" })
	status!: EmailVerificationStatus;

	@DateValidation({ description: "만료 시각" })
	expiresAt!: Date;

	@DateValidationOptional({ nullable: true, description: "인증 시각" })
	verifiedAt!: Date | null;

	@DateValidationOptional({ nullable: true, description: "마지막 발송 시각" })
	lastSentAt!: Date | null;

	@NumberValidation({ description: "발송 횟수", min: 0 })
	sendCount!: number;

	@StringValidationOptional({ nullable: true, description: "마지막 발송 상태" })
	lastSendStatus!: string | null;

	@StringValidationOptional({ nullable: true, description: "마지막 발송 오류" })
	lastSendError!: string | null;

	@BigIntIdValidationOptional({
		nullable: true,
		description: "인증 완료 사용자 ID",
	})
	verifiedUserId!: bigint | null;
}
