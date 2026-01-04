import { AbilityActions, AbilityTypes } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SubjectResponseDto } from "./subject-response.dto";

/**
 * Ability 응답 DTO
 */
export class AbilityResponseDto {
	@ApiProperty({
		description: "Ability ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "권한 타입 (허용/거부)",
		enum: AbilityTypes,
		example: AbilityTypes.CAN,
	})
	@Expose()
	type!: AbilityTypes;

	@ApiProperty({
		description: "권한 액션",
		enum: AbilityActions,
		example: AbilityActions.READ,
	})
	@Expose()
	action!: AbilityActions;

	@ApiProperty({
		description: "Role ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@Expose()
	roleId!: string;

	@ApiProperty({
		description: "권한 설명",
		example: "회원 목록 조회 권한",
		required: false,
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { ownerId: { $eq: "userId" } },
		required: false,
		nullable: true,
	})
	@Expose()
	conditions?: Record<string, unknown>;

	@ApiProperty({
		description: "Subject ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440002",
	})
	@Expose()
	subjectId!: string;

	@ApiProperty({
		description: "Subject 정보",
		type: () => SubjectResponseDto,
		required: false,
	})
	@Expose()
	@Type(() => SubjectResponseDto)
	subject?: SubjectResponseDto;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
	})
	@Expose()
	isActive!: boolean;

	@ApiProperty({
		description: "생성 일시",
		example: "2025-01-01T00:00:00.000Z",
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		description: "수정 일시",
		example: "2025-01-01T00:00:00.000Z",
		required: false,
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;
}
