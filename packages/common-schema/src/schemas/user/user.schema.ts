import { DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH } from "../../constants";
import { Email, Password, Phone, String } from "../../decorators";

/**
 * User 모델의 공용 입력 검증 규칙입니다.
 */
export class UserSchema {
	/** User 이름 입력값입니다. */
	@String({ minLength: 2, maxLength: 50 })
	name: string;

	/** User 이메일 입력값입니다. */
	@Email()
	email: string;

	/** User 전화번호 입력값입니다. */
	@Phone()
	phone: string;

	/** User 비밀번호 입력값입니다. */
	@Password({ minLength: DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH })
	password: string;
}
