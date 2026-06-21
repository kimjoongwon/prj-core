import type { Policy as PolicyEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { PolicyAbility } from "./policy-ability.entity";
import { RolePolicy } from "./role-policy.entity";
import type { Tenant } from "./tenant.entity";
import { UserPolicy } from "./user-policy.entity";

/**
 * Policy 엔티티
 *
 * Space별로 여러 Ability를 묶어 Role/User에 할당하는 권한 정책입니다.
 */
export class Policy extends AbstractEntity implements PolicyEntity {
	tenantId!: string;
	name!: string;
	displayName!: string | null;
	description!: string | null;
	isSystem!: boolean;

	tenant?: Tenant;

	@Type(() => PolicyAbility)
	policyAbilities?: PolicyAbility[];

	@Type(() => RolePolicy)
	rolePolicies?: RolePolicy[];

	@Type(() => UserPolicy)
	userPolicies?: UserPolicy[];

	isRemoved(): boolean {
		return this.removedAt !== null;
	}
}
