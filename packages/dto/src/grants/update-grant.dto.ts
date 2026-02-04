import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

/**
 * Grant 수정 DTO
 *
 * @description
 * Grant의 활성화 여부 및 우선순위를 수정합니다.
 * granteeType, granteeId, abilityId는 변경할 수 없습니다 (unique 제약).
 */
export class UpdateGrantDto {
	@ApiPropertyOptional({
		description: "활성화 여부",
		example: true,
	})
	@IsBoolean({ message: "활성화 여부는 boolean 타입이어야 합니다" })
	@IsOptional()
	isActive?: boolean;

	@ApiPropertyOptional({
		description: "우선순위 (높을수록 우선)",
		example: 5,
	})
	@IsNumber({}, { message: "우선순위는 숫자여야 합니다" })
	@IsOptional()
	priority?: number;
}
