import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import { CreateAbilityDto } from "./create-ability/create-ability.dto";

/**
 * Role 권한 일괄 수정 요청 DTO
 */
export class UpdateRoleAbilitiesRequestDto {
	@ApiProperty({
		description: "생성할 Ability 목록",
		type: [CreateAbilityDto],
		example: [
			{
				actionName: "read",
				subjectName: "entity:User",
				inverted: false,
				name: "사용자 조회",
				isActive: true,
			},
		],
	})
	@IsArray({ message: "abilities는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => CreateAbilityDto)
	abilities!: CreateAbilityDto[];
}
