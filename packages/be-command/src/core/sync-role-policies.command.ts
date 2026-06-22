import type { SyncRolePoliciesCommandInput } from "@cocrepo/input";
export class SyncRolePoliciesCommand implements SyncRolePoliciesCommandInput {
	readonly rolePolicies!: SyncRolePoliciesCommandInput["rolePolicies"];

	constructor(
		readonly roleId: string,
		input: SyncRolePoliciesCommandInput,
	) {
		Object.assign(this, input);
	}
}
