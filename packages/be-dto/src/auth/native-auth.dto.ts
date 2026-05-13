import {
	BooleanFieldOptional,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user.dto";
import { LoginPayloadDto } from "./login-payload.dto";

export class NativeLoginPayloadDto extends LoginPayloadDto {}

export class NativeTokenRefreshPayloadDto {
	@ApiProperty({
		description: "모바일 native 세션 ID",
		example: "user-mobile.0123456789abcdef0123456789abcdef",
	})
	@StringField()
	sessionId!: string;

	@ApiProperty({
		description: "모바일 native refresh token",
		example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
	})
	@StringField()
	refreshToken!: string;
}

export class NativeLogoutPayloadDto {
	@ApiProperty({
		description: "모바일 native 세션 ID",
		example: "user-mobile.0123456789abcdef0123456789abcdef",
	})
	@StringField()
	sessionId!: string;

	@ApiProperty({
		description: "모바일 native refresh token",
		example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
		required: false,
	})
	@StringFieldOptional()
	refreshToken?: string;
}

export class NativeAuthResponseDto {
	@ApiProperty({
		description: "모바일 native JWT Access Token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@StringField()
	accessToken!: string;

	@ApiProperty({
		description: "모바일 native Refresh Token",
		example: "GQ7l_Vg3aBsR03imRRYwR4q9gL53RhTYNqswp7Xp0uc",
	})
	@StringField()
	refreshToken!: string;

	@ApiProperty({
		description: "모바일 native 세션 ID",
		example: "user-mobile.0123456789abcdef0123456789abcdef",
	})
	@StringField()
	sessionId!: string;

	@ApiProperty({
		description: "Access Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704067200000,
	})
	@NumberField()
	accessTokenExpiresAt!: number;

	@ApiProperty({
		description: "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704672000000,
	})
	@NumberField()
	refreshTokenExpiresAt!: number;

	@ApiProperty({
		description: "인증된 사용자 정보",
		type: () => UserDto,
	})
	@ClassField(() => UserDto)
	user!: UserDto;

	@ApiProperty({
		description: "비밀번호 변경 필요 여부",
		required: false,
		example: false,
	})
	@BooleanFieldOptional()
	mustChangePassword?: boolean;
}
