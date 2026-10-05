import { DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH } from "../../constants";
import { Email, Password, Phone, String } from "../../decorators";
import { PickSchemaType } from "../../utils/mapped-schema";
import { UserSchema } from "./user.schema";

/**
 * User 모델의 공용 입력 검증 규칙입니다.
 */
export class UserFormSchema extends PickSchemaType(UserSchema, [
	"name",
	"email",
	"phone",
	"password",
] as const) {
	/** User 이름 입력값입니다. */
	@String({ minLength: 2, maxLength: 50 })
	declare name: UserSchema["name"];

	/** User 이메일 입력값입니다. */
	@Email()
	declare email: UserSchema["email"];

	/** User 전화번호 입력값입니다. */
	@Phone()
	declare phone: UserSchema["phone"];

	/** User 비밀번호 입력값입니다. */
	@Password({ minLength: DEFAULT_SCHEMA_PASSWORD_MIN_LENGTH })
	declare password: UserSchema["password"];
}
