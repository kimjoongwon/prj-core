import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Policy } from "./policy.entity";
import type { Role } from "./role.entity";

/**
 * RoleAssignment 엔티티
 *
 * Role에 Space별 Policy를 할당합니다.
 */
export class RoleAssignment extends AbstractEntity {
	/** 공개 식별자 ULID */
	roleAssignmentId!: string;

	roleId!: bigint;
	policyId!: bigint;
	isActive!: boolean;
	priority!: number;

	role?: Role;

	@Type(() => Policy)
	policy?: Policy;

	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}
}
