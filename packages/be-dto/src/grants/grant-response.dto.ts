import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { AbilityResponseDto } from "../abilities/ability-response.dto";

/**
 * Grant 응답 DTO
 *
 * @description
 * Role 또는 User에게 할당된 권한 정보를 반환합니다.
 */
export class GrantResponseDto {
	@ApiProperty({
		description: "Grant ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "권한 대상 유형 (Role 또는 User)",
		example: "Role",
	})
	@Expose()
	granteeType!: string;

	@ApiProperty({
		description: "권한 대상 ID (Role ID 또는 User ID)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@Expose()
	granteeId!: string;

	@ApiProperty({
		description: "Ability ID (부여된 권한)",
		example: "550e8400-e29b-41d4-a716-446655440002",
	})
	@Expose()
	abilityId!: string;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
	})
	@Expose()
	isActive!: boolean;

	@ApiProperty({
		description: "우선순위 (높을수록 우선)",
		example: 0,
	})
	@Expose()
	priority!: number;

	@ApiProperty({
		description: "생성 일시",
		example: "2025-01-01T00:00:00.000Z",
	})
	@Expose()
	createdAt!: Date;

	@ApiPropertyOptional({
		description: "수정 일시",
		example: "2025-01-01T00:00:00.000Z",
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;

	@ApiPropertyOptional({
		description: "삭제 일시 (Soft Delete)",
		example: "2025-01-01T00:00:00.000Z",
		nullable: true,
	})
	@Expose()
	removedAt?: Date | null;

	@ApiPropertyOptional({
		description: "할당된 권한 상세 정보",
		type: () => AbilityResponseDto,
	})
	@Expose()
	@Type(() => AbilityResponseDto)
	ability?: AbilityResponseDto;
}
