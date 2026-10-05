import type { CreateRoleCommandInput } from "@cocrepo/input";
export class CreateRoleCommand implements CreateRoleCommandInput {
	readonly name!: CreateRoleCommandInput["name"];
	readonly displayName?: CreateRoleCommandInput["displayName"];
	readonly description?: CreateRoleCommandInput["description"];

	constructor(input: CreateRoleCommandInput) {
		Object.assign(this, input);
	}
}
