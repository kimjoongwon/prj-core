import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { AbilityResponseDto } from "../abilities/ability-response.dto";

export class PolicyAbilityResponseDto {
	@ApiProperty({
		description: "PolicyAbility ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "Policy ID",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@Expose()
	policyId!: string;

	@ApiProperty({
		description: "Ability ID",
		example: "550e8400-e29b-41d4-a716-446655440002",
	})
	@Expose()
	abilityId!: string;

	@ApiProperty({
		description: "생성 일시",
		example: "2026-01-01T00:00:00.000Z",
	})
	@Expose()
	createdAt!: Date;

	@ApiPropertyOptional({
		description: "수정 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;

	@ApiPropertyOptional({
		description: "삭제 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	@Expose()
	removedAt?: Date | null;

	@ApiPropertyOptional({
		description: "연결된 Ability 상세 정보",
		type: () => AbilityResponseDto,
	})
	@Expose()
	@Type(() => AbilityResponseDto)
	ability?: AbilityResponseDto;
}
