import { LoginSchema } from "@cocrepo/schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

/**
 * OIDC 로그인 요청 DTO
 *
 * OIDC Interaction 흐름에서 사용자 인증을 위한 로그인 폼 데이터.
 * LoginSchema를 확장하여 remember 필드를 추가합니다.
 */
export class OidcLoginPayloadDto extends LoginSchema {
	@ApiProperty({
		example: "user@example.com",
		description: "사용자 이메일 주소",
	})
	email: string;

	@ApiProperty({
		example: "password123",
		description: "사용자 비밀번호",
	})
	password: string;

	@ApiPropertyOptional({
		description: "로그인 상태 유지 여부",
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	remember?: boolean;
}
