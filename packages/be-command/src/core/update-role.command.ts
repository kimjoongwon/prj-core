import type { UpdateRoleCommandInput } from "./update-role.input";
export class UpdateRoleCommand {
	constructor(
		readonly roleId: string,
		readonly input: UpdateRoleCommandInput,
	) {}
}
