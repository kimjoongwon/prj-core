import type { PolicyAbility as PolicyAbilityEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { Policy } from "./policy.entity";

/**
 * PolicyAbility 엔티티
 *
 * Policy와 Ability를 연결하는 구성 링크입니다.
 */
export class PolicyAbility
	extends AbstractEntity
	implements PolicyAbilityEntity
{
	policyId!: string;
	abilityId!: string;

	policy?: Policy;

	@Type(() => Ability)
	ability?: Ability;
}
