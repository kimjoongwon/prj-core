import { StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/interaction/:uid/login 성공 응답
 */
export class LoginSuccessDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;
}
