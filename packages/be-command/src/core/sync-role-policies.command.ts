import type { SyncRolePoliciesCommandInput } from "./sync-role-policies.input";
export class SyncRolePoliciesCommand {
	constructor(
		readonly roleId: string,
		readonly input: SyncRolePoliciesCommandInput,
	) {}
}
