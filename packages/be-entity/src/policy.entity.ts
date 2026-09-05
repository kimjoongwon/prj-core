import {
	BigIntIdField,
	ClassField,
	StringField,
} from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { PolicyEntry } from "./policy-entry.entity";
import { RoleAssignment } from "./role-assignment.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

/** Space별 Ability를 묶어 Role에 할당하는 권한 정책입니다. */
export class Policy extends AbstractEntity {
	@Exclude({ toPlainOnly: true })
	policyId!: string;
	@BigIntIdField({ description: "Policy ID" })
	declare id: bigint;

	@BigIntIdField({ description: "Space ID" })
	spaceId!: bigint;

	@BigIntIdField({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@StringField({
		description: "정책 식별자",
		example: "space-admin",
	})
	name!: string;

	@ApiProperty({
		description: "정책 표시명",
		example: "워크스페이스 관리자 정책",
		nullable: true,
	})
	displayName!: string | null;

	@ApiProperty({
		description: "정책 설명",
		example: "워크스페이스 관리자가 기본으로 갖는 권한 묶음입니다.",
		nullable: true,
	})
	description!: string | null;

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
	@ClassField(() => RoleAssignment, { required: false, each: true })
	roleAssignments?: RoleAssignment[];
	isRemoved(): boolean {
		return this.removedAt !== null;
	}
}
