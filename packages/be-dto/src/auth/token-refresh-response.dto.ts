import {
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user.dto";

/**
 * 토큰 갱신 응답 DTO
 */
export class TokenRefreshResponseDto {
	@ApiProperty({
		description: "새로 발급된 JWT Access Token",
		example: "eyJhbGciOiJIUzI1NiIsR5cCI6IkpXVCJ9...",
	})
	@StringField()
	accessToken: string;

	@ApiProperty({
		description:
			"갱신된 세션 식별자. HttpOnly sessionId 쿠키를 가진 웹 클라이언트가 스토어를 부트스트랩할 때 사용한다. 쿠키가 없으면 null",
		example: "admin-web.0123456789abcdef0123456789abcdef",
		nullable: true,
	})
	@StringFieldOptional()
	sessionId?: string | null;


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
