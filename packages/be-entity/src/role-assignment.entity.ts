import type { RoleAssignment as RoleAssignmentEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import { Policy } from "./policy.entity";
import type { Role } from "./role.entity";

/**
 * RoleAssignment 엔티티
 *
 * Role에 Space별 Policy를 할당합니다.
 */
export class RoleAssignment
	extends AbstractEntity
	implements DomainEntityModel<RoleAssignmentEntity>
{
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
