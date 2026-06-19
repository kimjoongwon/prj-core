import type { UpdateSpaceGroundCommandInput } from "./update-space-ground.input";
export class UpdateSpaceGroundCommand {
	constructor(
		readonly spaceId: string,
		readonly input: UpdateSpaceGroundCommandInput,
	) {}
}
