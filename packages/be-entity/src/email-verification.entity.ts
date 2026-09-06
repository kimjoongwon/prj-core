import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	DateFieldMetadata,
	DateFieldOptionalMetadata,
	EnumFieldMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { EmailVerificationStatus } from "@cocrepo/enum";
import { EmailVerificationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { User } from "./user.entity";

@AbstractEntityFields()
export class EmailVerification extends EmailVerificationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare emailVerificationId: EmailVerificationSchema["emailVerificationId"];

	@StringFieldMetadata({ description: "이메일" })
	declare email: EmailVerificationSchema["email"];
	@StringFieldMetadata({ description: "이름" })
	declare name: EmailVerificationSchema["name"];
	declare nickname: EmailVerificationSchema["nickname"];
	@StringFieldMetadata({ description: "전화번호" })
	declare phone: EmailVerificationSchema["phone"];
	@StringFieldMetadata({ description: "주소" })
	declare address: EmailVerificationSchema["address"];
	@BigIntIdFieldMetadata({ description: "소속 Space ID" })
	declare spaceId: EmailVerificationSchema["spaceId"];
	@Exclude({ toPlainOnly: true })
	declare passwordHash: EmailVerificationSchema["passwordHash"];
	@Exclude({ toPlainOnly: true })
	declare tokenHash: EmailVerificationSchema["tokenHash"];
	@EnumFieldMetadata(() => EmailVerificationStatus, { description: "상태" })
	declare status: EmailVerificationSchema["status"];
	@DateFieldMetadata({ description: "만료 시각" })
	declare expiresAt: EmailVerificationSchema["expiresAt"];
	@DateFieldOptionalMetadata({ nullable: true, description: "인증 시각" })
	declare verifiedAt: EmailVerificationSchema["verifiedAt"];
	@DateFieldOptionalMetadata({
		nullable: true,
		description: "마지막 발송 시각",
	})
	declare lastSentAt: EmailVerificationSchema["lastSentAt"];
	@NumberFieldMetadata({ description: "발송 횟수", min: 0 })
	declare sendCount: EmailVerificationSchema["sendCount"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "마지막 발송 상태",
	})
	declare lastSendStatus: EmailVerificationSchema["lastSendStatus"];
	@StringFieldOptionalMetadata({
		nullable: true,
		description: "마지막 발송 오류",
	})
	declare lastSendError: EmailVerificationSchema["lastSendError"];
	@BigIntIdFieldOptionalMetadata({
		nullable: true,
		description: "인증 완료 사용자 ID",
	})
	declare verifiedUserId: EmailVerificationSchema["verifiedUserId"];
	@ClassField(() => User, { required: false, nullable: true })
	verifiedUser?: User | null;
}
