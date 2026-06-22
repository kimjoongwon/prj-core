import type { SetCurrentSpaceCommandInput } from "@cocrepo/input";
export class SetCurrentSpaceCommand implements SetCurrentSpaceCommandInput {
	readonly tenantId!: SetCurrentSpaceCommandInput["tenantId"];

	constructor(input: SetCurrentSpaceCommandInput) {
		Object.assign(this, input);
	}
}
