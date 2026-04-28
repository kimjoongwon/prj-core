import type { RolePolicy as RolePolicyEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Policy } from "./policy.entity";
import type { Role } from "./role.entity";

/**
 * RolePolicy 엔티티
 *
 * Role에 Space별 Policy를 할당합니다.
 */
export class RolePolicy extends AbstractEntity implements RolePolicyEntity {
	roleId!: string;
	policyId!: string;
	isActive!: boolean;
	priority!: number;

	role?: Role;

	@Type(() => Policy)
	policy?: Policy;

	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}
}
