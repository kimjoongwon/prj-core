import type { SyncUserPoliciesDto } from "@cocrepo/dto";

export class SyncUserPoliciesCommand {
	constructor(
		readonly userId: string,
		readonly userPolicies: SyncUserPoliciesDto["userPolicies"],
	) {}
}
