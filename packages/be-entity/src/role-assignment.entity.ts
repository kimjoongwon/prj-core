import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Policy } from "./policy.entity";
import type { Role } from "./role.entity";
/** Role에 Space별 Policy를 할당합니다. */
export class RoleAssignment extends AbstractEntity {
	@Exclude({ toPlainOnly: true })
	roleAssignmentId!: string;
	@BigIntIdField({ description: "Role assignment ID" })
	declare id: bigint;

	@BigIntIdField({ description: "Role ID" })
	roleId!: bigint;

	@BigIntIdField({ description: "Policy ID" })
	policyId!: bigint;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
	})
	isActive!: boolean;

	@ApiProperty({
		description: "우선순위 (높을수록 우선)",
		example: 0,
	})
	priority!: number;

	@ApiProperty({
		description: "생성 일시",
		example: "2026-01-01T00:00:00.000Z",
	})
	declare createdAt: Date;

	@ApiProperty({
		description: "수정 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	declare updatedAt: Date | null;

	@ApiProperty({
		description: "삭제 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	declare removedAt: Date | null;
	role?: Role;
	@ClassField(() => Policy, {
		required: false,
		description: "할당된 Policy 상세 정보",
	})
	policy?: Policy;
	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}
}
