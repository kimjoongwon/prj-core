import { PolicyEntry } from "@cocrepo/entity";
import { AbilityResponseDto } from "../abilities/ability-response.dto";
import { EntityResponseType } from "../mapped-types";

export class PolicyEntryResponseDto extends EntityResponseType(PolicyEntry, {
	pick: [
		"id",
		"policyId",
		"abilityId",
		"createdAt",
		"updatedAt",
		"removedAt",
		"ability",
	] as const,
	relations: { ability: () => AbilityResponseDto },
}) {
	declare ability?: AbilityResponseDto;
}
