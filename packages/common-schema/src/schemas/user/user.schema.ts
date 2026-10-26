import {
	EmailValidation,
	StoredStringValidation,
	StringValidation,
	ULIDValidation,
	DateValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** User의 DB 필드 타입과 공통 검증입니다. */
export class UserSchema extends AbstractSchema {
	@ULIDValidation()
	userId!: string;

	@StringValidation({ description: "연락처" })
	phone!: string;

	@StringValidation({ description: "사용자 이름" })
	name!: string;

	@EmailValidation({ description: "이메일 주소" })
	email!: string;

	@StoredStringValidation()
	password!: string;

	@DateValidation({ nullable: true, description: "비밀번호 변경일" })
	passwordChangedAt!: Date | null;
}
