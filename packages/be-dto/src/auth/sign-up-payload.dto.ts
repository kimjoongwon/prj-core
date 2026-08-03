import {
	BigIntIdField,
	EmailField,
	PhoneField,
	StringField,
} from "@cocrepo/decorator/field";
import { PasswordField } from "@cocrepo/decorator/field/password";

/**
 * 회원가입 요청 DTO
 *
 * 공유 SignUpSchema의 wire 검증과 같은 규칙을 사용하며 숫자 ID는 bigint로 변환합니다.
 */
export class SignUpPayloadDto {
	@StringField({
		minLength: 2,
		maxLength: 50,
		example: "홍길동",
		description: "닉네임 (2-50자)",
	})
	nickname: string;

	@BigIntIdField({
		example: "1",
		description: "스페이스 ID",
	})
	spaceId: bigint;

	@EmailField({
		example: "user@example.com",
		description: "이메일",
	})
	email: string;

	@StringField({
		minLength: 2,
		maxLength: 50,
		example: "홍길동",
		description: "이름 (2-50자)",
	})
	name: string;

	@PhoneField({
		example: "010-1234-5678",
		description: "전화번호",
	})
	phone: string;

	@StringField({
		minLength: 2,
		maxLength: 255,
		example: "서울특별시 강남구 테헤란로 123",
		description: "주소 (2-255자)",
	})
	address: string;

	@PasswordField({
		example: "Password123!",
		description: "비밀번호 (10자 이상, 72자 이하)",
	})
	password: string;
}
