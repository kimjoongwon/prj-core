import { ClassField, NumberField, StringField } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user.dto";

/**
 * 토큰 갱신 응답 DTO
 */
export class TokenRefreshResponseDto {
	@ApiProperty({
		description: "새로 발급된 JWT Access Token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@StringField()
	accessToken: string;

	@ApiProperty({
		description: "새로 발급된 JWT Refresh Token",
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
