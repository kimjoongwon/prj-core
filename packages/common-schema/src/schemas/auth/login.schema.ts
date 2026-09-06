import { Email, Password } from "../../decorators";
import { PickSchemaType } from "../../utils/mapped-schema";
import { UserSchema } from "../user/user.schema";

/** User 공통 검증에서 파생한 로그인 입력 계약입니다. */
export class LoginSchema extends PickSchemaType(UserSchema, [
	"email",
	"password",
] as const) {
	/** 로그인 입력의 기존 한글 오류 메시지를 유지합니다. */
	@Email()
	declare email: UserSchema["email"];

	@Password({ minLength: 8 })
	declare password: UserSchema["password"];
}
