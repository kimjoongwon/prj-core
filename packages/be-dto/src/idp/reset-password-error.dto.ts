import { StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/reset-password/:token 실패 응답
 */
export class ResetPasswordErrorDto {
	@StringField({ description: "에러 코드" })
	error!: string;
}
