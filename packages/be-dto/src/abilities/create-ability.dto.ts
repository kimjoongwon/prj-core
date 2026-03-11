import { Prisma } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";

/**
 * 단일 Ability 생성 DTO (CASL ABAC 기반)
 *
 * @description
 * DDD 원칙에 따라 actionId로 Action을 참조합니다.
 * actionName은 편의를 위해 제공되며, actionId가 없을 때 사용됩니다.
 */
export class CreateAbilityDto {
	@ApiProperty({
		description: "Action ID (UUID) - actionId 또는 actionName 중 하나 필수",
		example: "550e8400-e29b-41d4-a716-446655440000",
		required: false,
	})
	@IsUUID("4", { message: "유효한 Action ID를 입력해주세요" })
	@IsOptional()
	actionId?: string;

	@ApiProperty({
		description:
			"Action 이름 - actionId가 없을 때 사용 (create, read, read:masked:email 등)",
		example: "read",
		required: false,
	})
	@IsString({ message: "Action 이름은 문자열이어야 합니다" })
	@IsOptional()
	actionName?: string;

	@ApiProperty({
		description: "Subject ID (UUID) - subjectId 또는 subjectName 중 하나 필수",
		example: "550e8400-e29b-41d4-a716-446655440001",
		required: false,
	})
	@IsUUID("4", { message: "유효한 Subject ID를 입력해주세요" })
	@IsOptional()
	subjectId?: string;

	@ApiProperty({
		description:
			"Subject 이름 - subjectId가 없을 때 사용 (entity:User, menu:settings 등)",
		example: "entity:User",
		required: false,
	})
	@IsString({ message: "Subject 이름은 문자열이어야 합니다" })
	@IsOptional()
	subjectName?: string;

	@ApiProperty({
		description: "대상 필드 목록 (빈 배열이면 전체 필드)",
		example: ["email", "name"],
		required: false,
		default: [],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	fields?: string[];

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { id: "${user.id}" },
		required: false,
	})
	@IsOptional()
	conditions?: Prisma.InputJsonValue;

	@ApiProperty({
		description: "거부 권한 여부 (true: cannot, false: can)",
		example: false,
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	inverted?: boolean;

	@ApiProperty({
		description: "거부 사유 (inverted=true일 때 사용)",
		example: "관리자만 삭제할 수 있습니다",
		required: false,
	})
	@IsString()
	@IsOptional()
	reason?: string;

	@ApiProperty({
		description: "Role ID (Role 기반 권한일 때)",
		example: "550e8400-e29b-41d4-a716-446655440000",
		required: false,
	})
	@IsUUID("4", { message: "유효한 Role ID를 입력해주세요" })
	@IsOptional()
	roleId?: string;

	@ApiProperty({
		description: "User ID (User 예외 권한일 때)",
		example: "550e8400-e29b-41d4-a716-446655440001",
		required: false,
	})
	@IsUUID("4", { message: "유효한 User ID를 입력해주세요" })
	@IsOptional()
	userId?: string;

	@ApiProperty({
		description: "권한 이름",
		example: "본인 정보 조회",
		required: false,
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: "권한 설명",
		example: "자신의 프로필 정보만 조회할 수 있습니다",
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@ApiProperty({
		description: "우선순위 (높을수록 우선)",
		example: 0,
		default: 0,
	})
	@IsNumber()
	@IsOptional()
	priority?: number;
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

/**
 * Ability 생성 입력 타입 (Service/ApplicationService용)
 *
 * DTO에서 roleId/userId를 추가한 형태입니다.
 * actionName/subjectName으로 지정 시 Service에서 ID로 변환됩니다.
 */
export type CreateAbilityInput = CreateAbilityDto & {
	roleId?: string;
	userId?: string;
};
