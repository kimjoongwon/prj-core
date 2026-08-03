import {
	BigIntIdField,
	BigIntIdFieldOptional,
	BooleanField,
	DateField,
	DateFieldOptional,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { EmailVerificationStatus } from "@cocrepo/prisma";

export class EmailVerificationDto {
	@BigIntIdField({ description: "ID" })
	id!: bigint;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@DateFieldOptional({ nullable: true, description: "수정일" })
	updatedAt!: Date | null;

	@StringField({ description: "이메일" })
	email!: string;

	@StringField({ description: "이름" })
	name!: string;

	@EnumField(() => EmailVerificationStatus, { description: "상태" })
	status!: EmailVerificationStatus;

	@DateField({ description: "만료 시각" })
	expiresAt!: Date;

	@DateFieldOptional({ nullable: true, description: "인증 시각" })
	verifiedAt!: Date | null;

	@DateFieldOptional({ nullable: true, description: "마지막 발송 시각" })
	lastSentAt!: Date | null;

	@NumberField({ description: "발송 횟수", min: 0 })
	sendCount!: number;

	@StringFieldOptional({ nullable: true, description: "마지막 발송 상태" })
	lastSendStatus!: string | null;

	@BigIntIdFieldOptional({ nullable: true, description: "인증 완료 사용자 ID" })
	verifiedUserId!: bigint | null;

	@BooleanField({ description: "재발송 가능 여부" })
	canResend!: boolean;

	@DateFieldOptional({ nullable: true, description: "재발송 가능 시각" })
	resendAvailableAt!: Date | null;
}
