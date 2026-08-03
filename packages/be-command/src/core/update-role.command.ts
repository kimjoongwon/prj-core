import type { UpdateRoleCommandInput } from "@cocrepo/input";
export class UpdateRoleCommand implements UpdateRoleCommandInput {
	readonly displayName?: UpdateRoleCommandInput["displayName"];
	readonly description?: UpdateRoleCommandInput["description"];

	constructor(
		readonly roleId: bigint,
		input: UpdateRoleCommandInput,
	) {
		Object.assign(this, input);
	}
}
