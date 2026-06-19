import type { UpdateActionCommandInput } from "./update-action.input";
export class UpdateActionCommand {
	constructor(
		readonly actionId: string,
		readonly input: UpdateActionCommandInput,
	) {}
}
