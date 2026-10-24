import {
	ULIDField,
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
	@ULIDField({
		minLength: 2,
		maxLength: 50,
		example: "홍길동",
		description: "닉네임 (2-50자)",
	})
	nickname: string;

	@ULIDField({
		example: "01J00000000000000000000001",
		description: "가입할 공간 공개 ID (ULID)",
	})
	spaceId: string;

	@EmailField({
		example: "user@example.com",
		description: "이메일",
	})
	email: string;

	@ULIDField({
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

	@ULIDField({
		minLength: 2,
		maxLength: 255,
		example: "서울특별시 강남구 샘플로 123",
		description: "주소 (2-255자)",
	})
	address: string;

	@PasswordField({
		example: "Password123!",
		description: "비밀번호 (10자 이상, 72자 이하)",
	})
	password: string;
}
