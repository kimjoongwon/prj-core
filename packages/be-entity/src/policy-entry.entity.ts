import type { PolicyEntry as PolicyEntryEntity } from "@cocrepo/prisma";
import { Type } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Policy } from "./policy.entity";

/**
 * PolicyEntry 엔티티
 *
 * Policy와 Ability를 연결하는 구성 링크입니다.
 */
export class PolicyEntry
	extends AbstractEntity
	implements DomainEntityModel<PolicyEntryEntity>
{
	policyId!: string;
	abilityId!: string;

	policy?: Policy;

	@Type(() => Ability)
	ability?: Ability;
}
