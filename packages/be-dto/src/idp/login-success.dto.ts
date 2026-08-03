import { BooleanFieldOptional, StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/interaction/:uid/login 성공 응답
 */
export class LoginSuccessDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;

	@BooleanFieldOptional({ description: "비밀번호 변경 필요 여부" })
	mustChangePassword?: boolean;
}
