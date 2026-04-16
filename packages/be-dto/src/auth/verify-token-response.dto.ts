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
			"현재 `x-space-id`로 해석된 tenant role이 `FULL_ACCESS`인지 여부",
	})
	hasFullAccess!: boolean;
}
