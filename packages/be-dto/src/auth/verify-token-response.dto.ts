import { ApiProperty } from "@nestjs/swagger";

export class VerifyTokenResponseDto {
	@ApiProperty({ description: "토큰 유효 여부" })
	valid!: boolean;

	@ApiProperty({ description: "Access Token 만료 시간 (Unix timestamp, ms)" })
	accessTokenExpiresAt!: number;

	@ApiProperty({ description: "Refresh Token 만료 시간 (Unix timestamp, ms)" })
	refreshTokenExpiresAt!: number;

	@ApiProperty({
		description:
			"현재 사용자가 tenant 역할 기준으로 FULL_ACCESS 권한을 하나라도 보유하는지 여부",
	})
	hasFullAccess!: boolean;
}
