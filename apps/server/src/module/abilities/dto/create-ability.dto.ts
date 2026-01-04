import { AbilityActions, AbilityTypes, Prisma } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";

/**
 * 단일 Ability 생성 DTO
 */
export class CreateAbilityDto {
	@ApiProperty({
		description: "권한 타입 (허용/거부)",
		enum: AbilityTypes,
		example: AbilityTypes.CAN,
	})
	@IsEnum(AbilityTypes, { message: "유효한 권한 타입을 입력해주세요" })
	type!: AbilityTypes;

	@ApiProperty({
		description: "권한 액션",
		enum: AbilityActions,
		example: AbilityActions.READ,
	})
	@IsEnum(AbilityActions, { message: "유효한 권한 액션을 입력해주세요" })
	action!: AbilityActions;

	@ApiProperty({
		description: "권한 설명",
		example: "회원 목록 조회 권한",
		required: false,
	})
	@IsOptional()
	@IsString({ message: "설명은 문자열이어야 합니다" })
	description?: string;

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { ownerId: { $eq: "userId" } },
		required: false,
	})
	@IsOptional()
	conditions?: Prisma.InputJsonValue;

	@ApiProperty({
		description: "Subject ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@IsUUID("4", { message: "유효한 Subject ID를 입력해주세요" })
	subjectId!: string;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
		default: true,
		required: false,
	})
	@IsBoolean({ message: "활성화 여부는 boolean이어야 합니다" })
	@IsOptional()
	isActive?: boolean;
}

/**
 * Role 권한 일괄 수정 요청 DTO
 */
export class UpdateRoleAbilitiesRequestDto {
	@ApiProperty({
		description: "생성할 Ability 목록",
		type: [CreateAbilityDto],
		example: [
			{
				type: AbilityTypes.CAN,
				action: AbilityActions.READ,
				subjectId: "550e8400-e29b-41d4-a716-446655440000",
				description: "회원 목록 조회 권한",
				isActive: true,
			},
		],
	})
	@IsArray({ message: "abilities는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => CreateAbilityDto)
	abilities!: CreateAbilityDto[];
}
