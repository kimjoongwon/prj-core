import type { SyncUserPoliciesCommandInput } from "@cocrepo/input";
export class SyncUserPoliciesCommand implements SyncUserPoliciesCommandInput {
	readonly userPolicies!: SyncUserPoliciesCommandInput["userPolicies"];

	constructor(
		readonly userId: string,
		input: SyncUserPoliciesCommandInput,
	) {
		Object.assign(this, input);
	}
}
