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
 * RoleGrant 배치 할당 개별 항목 DTO
 */
export class BatchAssignRoleGrantItemDto {
	@ApiProperty({
		description: "Ability ID (Role에 부여할 권한)",
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
 * RoleGrant 배치 할당 요청 DTO
 */
export class BatchAssignRoleGrantRequestDto {
	@ApiProperty({
		description: "RoleGrant 목록 (역할에 할당할 Ability 목록)",
		type: [BatchAssignRoleGrantItemDto],
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
	@IsArray({ message: "roleGrants는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => BatchAssignRoleGrantItemDto)
	@IsNotEmpty({ message: "최소 1개 이상의 RoleGrant를 입력해주세요" })
	roleGrants!: BatchAssignRoleGrantItemDto[];
}
