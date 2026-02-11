import { Email, Password } from "../../decorators";

/**
 * 로그인 스키마
 *
 * 프론트엔드/백엔드 공유 검증 규칙
 */
export class LoginSchema {
	@Email()
	email: string;

	@Password({ minLength: 8 })
	password: string;
}
