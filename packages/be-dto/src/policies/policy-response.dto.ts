import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { PolicyAbilityResponseDto } from "./policy-ability-response.dto";

export class PolicyResponseDto {
	@ApiProperty({
		description: "Policy ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "Space ID",
		example: "550e8400-e29b-41d4-a716-446655440099",
	})
	@Expose()
	spaceId!: string;

	@ApiProperty({
		description: "정책 식별자",
		example: "workspace-admin",
	})
	@Expose()
	name!: string;

	@ApiPropertyOptional({
		description: "정책 표시명",
		example: "워크스페이스 관리자 정책",
		nullable: true,
	})
	@Expose()
	displayName?: string | null;

	@ApiPropertyOptional({
		description: "정책 설명",
		example: "워크스페이스 관리자가 기본으로 갖는 권한 묶음입니다.",
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "시스템 정책 여부",
		example: false,
	})
	@Expose()
	isSystem!: boolean;

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
		description: "정책에 연결된 Ability 목록",
		type: () => [PolicyAbilityResponseDto],
	})
	@Expose()
	@Type(() => PolicyAbilityResponseDto)
	policyAbilities?: PolicyAbilityResponseDto[];
}
