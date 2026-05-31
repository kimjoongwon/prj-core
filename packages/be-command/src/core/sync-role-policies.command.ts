import type { SyncRolePoliciesDto } from "@cocrepo/dto";

export class SyncRolePoliciesCommand {
	constructor(
		readonly roleId: string,
		readonly rolePolicies: SyncRolePoliciesDto["rolePolicies"],
	) {}
}
