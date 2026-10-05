import {
	BigIntIdFieldMetadata,
	ClassField,
	StringFieldMetadata,
} from "@cocrepo/decorator/field";
import { PolicySchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { PolicyEntry } from "./policy-entry.entity";
import { RoleAssignment } from "./role-assignment.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

/** Space별 Ability를 묶어 Role에 할당하는 권한 정책입니다. */
@AbstractEntityFields()
export class Policy extends PolicySchema {
	@Exclude({ toPlainOnly: true })
	declare policyId: PolicySchema["policyId"];
	@BigIntIdFieldMetadata({ description: "Policy ID" })
	declare id: bigint;

	@BigIntIdFieldMetadata({ description: "Space ID" })
	declare spaceId: PolicySchema["spaceId"];

	@BigIntIdFieldMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: PolicySchema["createdById"];

	@StringFieldMetadata({
		description: "정책 식별자",
		example: "space-admin",
	})
	declare name: PolicySchema["name"];

	@ApiProperty({
		type: String,
		description: "정책 표시명",
		example: "워크스페이스 관리자 정책",
		nullable: true,
	})
	declare displayName: PolicySchema["displayName"];

	@ApiProperty({
		type: String,
		description: "정책 설명",
		example: "워크스페이스 관리자가 기본으로 갖는 권한 묶음입니다.",
		nullable: true,
	})
	declare description: PolicySchema["description"];

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
	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => PolicyEntry, {
		required: false,
		isArray: true,
		description: "정책에 연결된 Ability 목록",
	})
	entries?: PolicyEntry[];
	@ClassField(() => RoleAssignment, {
		required: false,
		each: true,
		isArray: true,
	})
	roleAssignments?: RoleAssignment[];
	isRemoved(): boolean {
		return this.removedAt !== null;
	}
}
