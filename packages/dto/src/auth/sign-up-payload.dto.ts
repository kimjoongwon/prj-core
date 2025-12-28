import { SignUpSchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 회원가입 요청 DTO
 *
 * @cocrepo/schema의 SignUpSchema를 확장하여
 * Swagger 문서화 메타데이터를 추가합니다.
 */
export class SignUpPayloadDto extends SignUpSchema {
	@ApiProperty({
		example: "홍길동",
		description: "닉네임 (2-50자)",
	})
	nickname: string;

	@ApiProperty({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "스페이스 ID (UUID)",
	})
	spaceId: string;

	@ApiProperty({
		example: "user@example.com",
		description: "이메일",
	})
	email: string;

	@ApiProperty({
		example: "홍길동",
		description: "이름 (2-50자)",
	})
	name: string;

	@ApiProperty({
		example: "010-1234-5678",
		description: "전화번호",
	})
	phone: string;

	@ApiProperty({
		example: "Password123!",
		description: "비밀번호 (8자 이상)",
	})
	password: string;
}
