import type { SyncPolicyAbilitiesDto } from "@cocrepo/dto";

export class SyncPolicyAbilitiesCommand {
	constructor(
		readonly policyId: string,
		readonly abilityIds: SyncPolicyAbilitiesDto["abilityIds"],
	) {}
}
