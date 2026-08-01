import { ULIDField } from "@cocrepo/decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { PolicyResponseDto } from "../policies/policy-response.dto";

export class RoleAssignmentResponseDto {
	@ULIDField({ description: "Role assignment ID" })
	@Expose()
	id!: string;

	@ULIDField({ description: "Role ID" })
	@Expose()
	roleId!: string;

	@ULIDField({ description: "Policy ID" })
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
