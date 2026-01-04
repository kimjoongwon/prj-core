import {
	EmailField,
	PasswordField,
	PhoneField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { User } from "@cocrepo/entity";
import { Transform } from "class-transformer";

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
		description: "비밀번호 (8자 이상, 영문+숫자+특수문자)",
	})
	password: string;

	@UUIDField({
		description: "역할 ID",
	})
	roleId: string;

	@UUIDFieldOptional({
		description: "분류 카테고리 ID",
	})
	categoryId?: string;

	@StringFieldOptional({
		each: true,
		description: "그룹 ID 목록",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	groupIds?: string[];

	/**
	 * DTO → Entity 변환
	 */
	toEntity(): User {
		const user = new User();
		user.email = this.email;
		user.name = this.name;
		user.phone = this.phone;
		user.password = this.password;
		return user;
	}
}
