import { ClassField, NumberField, StringField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user.dto";

/**
 * 로그인 응답 DTO
 */
export class LoginResponseDto {
	@ApiProperty({
		description: "JWT Access Token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@StringField()
	accessToken: string;

	@ApiProperty({
		description: "JWT Refresh Token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@StringField()
	refreshToken: string;

	@ApiProperty({
		description: "Access Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704067200000,
	})
	@NumberField()
	accessTokenExpiresAt: number;

	@ApiProperty({
		description: "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704672000000,
	})
	@NumberField()
	refreshTokenExpiresAt: number;

	@ApiProperty({
		description: "인증된 사용자 정보",
		type: () => UserDto,
	})
	@ClassField(() => UserDto)
	user: UserDto;
}
