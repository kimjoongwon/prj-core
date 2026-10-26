import { BooleanField, DateFieldOptional } from "@cocrepo/decorator/field";
import { EmailVerification } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class EmailVerificationDto extends EntityResponseType(
	EmailVerification,
	{
		pick: [
			"id",
			"createdAt",
			"email",
			"name",
			"status",
			"expiresAt",
			"verifiedAt",
			"lastSentAt",
			"sendCount",
			"lastSendStatus",
			"verifiedUserId",
		] as const,

		extraFields: ["canResend", "resendAvailableAt", "updatedAt"],
	},
) {
	@DateFieldOptional({ nullable: true, description: "수정일" })
	updatedAt!: Date | null;

	@BooleanField({ description: "재발송 가능 여부" })
	canResend!: boolean;

	@DateFieldOptional({ nullable: true, description: "재발송 가능 시각" })
	resendAvailableAt!: Date | null;
}
