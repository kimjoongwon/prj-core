import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	DateField,
	DateFieldOptional,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { EmailVerificationStatus } from "@cocrepo/enum";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { User } from "./user.entity";

export class EmailVerification extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	emailVerificationId!: string;

	@StringField({ description: "이메일" })
	email!: string;
	@StringField({ description: "이름" })
	name!: string;
	nickname!: string;
	@StringField({ description: "전화번호" })
	phone!: string;
	@StringField({ description: "주소" })
	address!: string;
	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;
	@Exclude({ toPlainOnly: true })
	passwordHash!: string;
	@Exclude({ toPlainOnly: true })
	tokenHash!: string;
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
	@StringFieldOptional({ nullable: true, description: "마지막 발송 오류" })
	lastSendError!: string | null;
	@BigIntIdFieldOptional({ nullable: true, description: "인증 완료 사용자 ID" })
	verifiedUserId!: bigint | null;
	@ClassField(() => User, { required: false, nullable: true })
	verifiedUser?: User | null;
}
