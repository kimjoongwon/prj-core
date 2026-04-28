import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { PolicyResponseDto } from "../policies/policy-response.dto";

export class PolicyAssignmentResponseDto {
	@ApiProperty({
		description: "Policy assignment ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiPropertyOptional({
		description: "Role ID",
		example: "550e8400-e29b-41d4-a716-446655440001",
		nullable: true,
	})
	@Expose()
	roleId?: string | null;

	@ApiPropertyOptional({
		description: "User ID",
		example: "550e8400-e29b-41d4-a716-446655440002",
		nullable: true,
	})
	@Expose()
	userId?: string | null;

	@ApiProperty({
		description: "Policy ID",
		example: "550e8400-e29b-41d4-a716-446655440003",
	})
	@Expose()
	policyId!: string;

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
		description: "할당된 Policy 상세 정보",
		type: () => PolicyResponseDto,
	})
	@Expose()
	@Type(() => PolicyResponseDto)
	policy?: PolicyResponseDto;
}
