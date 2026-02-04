import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

/**
 * 로그인 요청 DTO
 *
 * OIDC Interaction에서 사용자 인증을 위한 로그인 폼 데이터
 */
export class LoginDto {
	@ApiProperty({
		description: "사용자 이메일 주소",
		example: "user@example.com",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "사용자 비밀번호",
		example: "password123",
	})
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiPropertyOptional({
		description: "로그인 상태 유지 여부",
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	remember?: boolean;
}
