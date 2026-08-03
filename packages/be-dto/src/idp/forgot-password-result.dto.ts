import { StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/forgot-password 응답
 */
export class ForgotPasswordResultDto {
	@StringField({ description: "응답 메시지" })
	message!: string;
}
