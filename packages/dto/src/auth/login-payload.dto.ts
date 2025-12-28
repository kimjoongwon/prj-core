import { LoginSchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 로그인 요청 DTO
 *
 * @cocrepo/schema의 LoginSchema를 확장하여
 * Swagger 문서화 메타데이터를 추가합니다.
 */
export class LoginPayloadDto extends LoginSchema {
	@ApiProperty({
		example: "plate@gmail.com",
		description: "사용자 이메일",
	})
	email: string;

	@ApiProperty({
		example: "rkdmf12!@",
		description: "사용자 비밀번호 (8자 이상)",
	})
	password: string;
}
