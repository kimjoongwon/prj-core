import {
	DateField,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";

export class OidcSessionDto {
	@ULIDField()
	id: string;

	@StringField({ description: "모델 키 (jti 또는 uid)" })
	key: string;

	@StringField({
		description: "모델 타입 (AccessToken, RefreshToken, Session 등)",
	})
	modelType: string;

	@StringFieldOptional({ description: "Grant ID (토큰 폐기용)" })
	grantId: string | null;

	@StringFieldOptional({ description: "세션 UID" })
	uid: string | null;

	@StringFieldOptional({ description: "계정 ID" })
	accountId: string | null;

	@DateField({ nullable: true })
	expiresAt: Date | null;

	@DateField()
	createdAt: Date;
}
