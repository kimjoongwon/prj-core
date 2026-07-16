import type { Policy as PolicyEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { PolicyAbility } from "./policy-ability.entity";
import { RolePolicy } from "./role-policy.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

/**
 * Policy 엔티티
 *
 * Space별로 여러 Ability를 묶어 Role에 할당하는 권한 정책입니다.
 */
export class Policy extends AbstractEntity implements PolicyEntity {
	spaceId!: string;
	createdById!: string | null;
	name!: string;
	displayName!: string | null;
	description!: string | null;
	isSystem!: boolean;

	space?: Space;
	createdBy?: User | null;

	@Type(() => PolicyAbility)
	policyAbilities?: PolicyAbility[];

	@Type(() => RolePolicy)
	rolePolicies?: RolePolicy[];

	isRemoved(): boolean {
		return this.removedAt !== null;
	}
}
