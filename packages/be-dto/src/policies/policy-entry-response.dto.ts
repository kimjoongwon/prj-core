import { BigIntIdField } from "@cocrepo/decorator/field";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { AbilityResponseDto } from "../abilities/ability-response.dto";

export class PolicyEntryResponseDto {
	@BigIntIdField({ description: "PolicyEntry ID" })
	@Expose()
	id!: bigint;

	@BigIntIdField({ description: "Policy ID" })
	@Expose()
	policyId!: bigint;

	@BigIntIdField({ description: "Ability ID" })
	@Expose()
	abilityId!: bigint;

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
