import {
	BigIntIdField,
	BigIntIdFieldOptional,
	EmailField,
	PhoneField,
	StringField,
} from "@cocrepo/decorator/field";
import { PasswordField } from "@cocrepo/decorator/field/password";

/**
 * 회원 등록용 DTO
 * 관리자가 새로운 회원을 등록할 때 사용합니다.
 */
export class CreateUserMemberDto {
	@StringField({
		minLength: 2,
		maxLength: 50,
		description: "사용자 이름",
	})
	name: string;

	@EmailField({
		description: "이메일 주소",
	})
	email: string;

	@PhoneField({
		description: "전화번호 (한국 휴대폰 형식)",
	})
	phone: string;

	@PasswordField({
		description: "비밀번호 (10자 이상, 72자 이하, 영문+숫자+특수문자)",
	})
	password: string;

	@BigIntIdField({
		description: "역할 ID",
	})
	roleId: bigint;

	@BigIntIdFieldOptional({
		description: "분류 카테고리 ID",
	})
	categoryId?: bigint;

	@BigIntIdFieldOptional({
		each: true,
		description: "그룹 ID 목록",
	})
	groupIds?: bigint[];
}
