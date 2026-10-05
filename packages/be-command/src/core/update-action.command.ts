import type { UpdateActionCommandInput } from "@cocrepo/input";
export class UpdateActionCommand implements UpdateActionCommandInput {
	readonly name?: UpdateActionCommandInput["name"];
	readonly displayName?: UpdateActionCommandInput["displayName"];
	readonly description?: UpdateActionCommandInput["description"];
	readonly group?: UpdateActionCommandInput["group"];
	readonly order?: UpdateActionCommandInput["order"];
	readonly config?: UpdateActionCommandInput["config"];

	constructor(
		readonly actionId: bigint,
		input: UpdateActionCommandInput,
	) {
		Object.assign(this, input);
	}
}
