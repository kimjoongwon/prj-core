import type { UpdateTimelineCommandInput } from "./update-timeline.input";
export class UpdateTimelineCommand {
	constructor(
		readonly timelineId: string,
		readonly input: UpdateTimelineCommandInput,
	) {}
}
