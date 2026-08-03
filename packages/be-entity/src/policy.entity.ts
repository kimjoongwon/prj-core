import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { PolicyEntry } from "./policy-entry.entity";
import { RoleAssignment } from "./role-assignment.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

/**
 * Policy 엔티티
 *
 * Space별로 여러 Ability를 묶어 Role에 할당하는 권한 정책입니다.
 */
export class Policy extends AbstractEntity {
	/** 공개 식별자 ULID */
	policyId!: string;

	spaceId!: bigint;
	createdById!: bigint | null;
	name!: string;
	displayName!: string | null;
	description!: string | null;

	space?: Space;
	createdBy?: User | null;

	@Type(() => PolicyEntry)
	entries?: PolicyEntry[];

	@Type(() => RoleAssignment)
	roleAssignments?: RoleAssignment[];

	isRemoved(): boolean {
		return this.removedAt !== null;
	}
}
