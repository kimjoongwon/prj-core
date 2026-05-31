import { DateField, StringField } from "@cocrepo/decorator";

export class EmailVerificationRequestedDto {
	@StringField({ description: "인증 요청 이메일" })
	email!: string;

	@DateField({ description: "인증 링크 만료 시각" })
	expiresAt!: Date;
}
