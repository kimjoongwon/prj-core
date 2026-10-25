import type { UpdateTimelineCommandInput } from "@cocrepo/input";
export class UpdateTimelineCommand implements UpdateTimelineCommandInput {
	readonly name?: UpdateTimelineCommandInput["name"];
	readonly description?: UpdateTimelineCommandInput["description"];

	constructor(
		readonly timelineId: string,
		input: UpdateTimelineCommandInput,
	) {
		Object.assign(this, input);
	}
}
