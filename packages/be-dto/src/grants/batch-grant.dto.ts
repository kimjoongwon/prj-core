import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

/**
 * Grant 배치 할당 개별 항목 DTO
 *
 * @description
 * 배치 할당 시 각 Ability에 대한 Grant 정보를 담습니다.
 */
export class BatchGrantItemDto {
	@ApiProperty({
		description: "Ability ID (부여할 권한)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@IsNotEmpty({ message: "Ability ID를 입력해주세요" })
	@IsUUID("4", { message: "유효한 UUID 형식이 아닙니다" })
	abilityId!: string;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
		default: true,
		required: false,
	})
	@IsBoolean({ message: "활성화 여부는 boolean 타입이어야 합니다" })
	@IsOptional()
	isActive?: boolean;

	@ApiProperty({
		description: "우선순위 (높을수록 우선, 기본값: 0)",
		example: 0,
		default: 0,
		required: false,
	})
	@IsNumber({}, { message: "우선순위는 숫자여야 합니다" })
	@IsOptional()
	priority?: number;
}

/**
 * Grant 배치 할당 요청 DTO
 *
 * @description
 * PUT /api/v1/grants/roles/:roleId 또는 /users/:userId
 * 특정 Role 또는 User에게 여러 Ability를 한 번에 할당합니다.
 */
export class BatchGrantRequestDto {
	@ApiProperty({
		description: "Grant 목록 (할당할 Ability 목록)",
		type: [BatchGrantItemDto],
		example: [
			{
				abilityId: "550e8400-e29b-41d4-a716-446655440001",
				isActive: true,
				priority: 0,
			},
			{
				abilityId: "550e8400-e29b-41d4-a716-446655440002",
				isActive: true,
				priority: 1,
			},
		],
	})
	@IsArray({ message: "grants는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => BatchGrantItemDto)
	@IsNotEmpty({ message: "최소 1개 이상의 Grant를 입력해주세요" })
	grants!: BatchGrantItemDto[];
}
