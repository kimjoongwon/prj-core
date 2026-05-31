import { StringField } from "@cocrepo/decorator";

/**
 * POST /api/reset-password/:token 성공 응답
 */
export class ResetPasswordResultDto {
	@StringField({ description: "응답 메시지" })
	message!: string;
}
