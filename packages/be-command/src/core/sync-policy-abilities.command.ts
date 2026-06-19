export class SyncPolicyAbilitiesCommand {
	constructor(
		readonly policyId: string,
		readonly abilityIds: string[],
	) {}
}
