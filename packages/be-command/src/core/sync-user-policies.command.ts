import type { SyncUserPoliciesCommandInput } from "./sync-user-policies.input";
export class SyncUserPoliciesCommand {
	constructor(
		readonly userId: string,
		readonly input: SyncUserPoliciesCommandInput,
	) {}
}
