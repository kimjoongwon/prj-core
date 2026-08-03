import type { CreateActionCommandInput } from "@cocrepo/input";
export class CreateActionCommand implements CreateActionCommandInput {
	readonly name!: CreateActionCommandInput["name"];
	readonly displayName!: CreateActionCommandInput["displayName"];
	readonly description!: CreateActionCommandInput["description"];
	readonly group!: CreateActionCommandInput["group"];
	readonly order!: CreateActionCommandInput["order"];
	readonly config!: CreateActionCommandInput["config"];

	constructor(input: CreateActionCommandInput) {
		Object.assign(this, input);
	}
}
