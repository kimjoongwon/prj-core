import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { RoleAssignmentSchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Policy } from "./policy.entity";
import type { Role } from "./role.entity";
/** Role에 Space별 Policy를 할당합니다. */
@AbstractEntityFields()
export class RoleAssignment extends RoleAssignmentSchema {
	@Exclude({ toPlainOnly: true })
	declare roleAssignmentId: RoleAssignmentSchema["roleAssignmentId"];
	@BigIntIdFieldMetadata({ description: "Role assignment ID" })
	declare id: bigint;

	@BigIntIdFieldMetadata({ description: "Role ID" })
	declare roleId: RoleAssignmentSchema["roleId"];

	@BigIntIdFieldMetadata({ description: "Policy ID" })
	declare policyId: RoleAssignmentSchema["policyId"];

	@ApiProperty({
		type: Boolean,
		description: "활성화 여부",
		example: true,
	})
	declare isActive: RoleAssignmentSchema["isActive"];

	@ApiProperty({
		type: Number,
		description: "우선순위 (높을수록 우선)",
		example: 0,
	})
	declare priority: RoleAssignmentSchema["priority"];

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
