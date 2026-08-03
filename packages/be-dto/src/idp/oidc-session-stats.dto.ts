import { NumberField } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";

/**
 * OIDC 세션/토큰 통계 DTO
 */
export class OidcSessionStatsDto {
	@NumberField({ description: "전체 세션/토큰 수" })
	totalCount!: number;

	@ApiProperty({
		description: "모델 타입별 건수",
		type: "object",
		additionalProperties: { type: "number" },
		example: {
			Session: 5,
			AccessToken: 10,
			RefreshToken: 8,
		},
	})
	byModelType!: Record<string, number>;
}
