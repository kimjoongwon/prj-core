import {
	ClassField,
	NumberFieldOptional,
	StringField,
} from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user.dto";

export class TokenDto {
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
		description: "인증된 사용자 정보",
		type: () => UserDto,
	})
	@ClassField(() => UserDto)
	user: UserDto;

	@ApiProperty({
		description: "Access Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704067200000,
	})
	@NumberFieldOptional()
	accessTokenExpiresAt?: number;

	@ApiProperty({
		description: "Refresh Token 만료 시간 (Unix timestamp, milliseconds)",
		example: 1704672000000,
	})
	@NumberFieldOptional()
	refreshTokenExpiresAt?: number;
}
