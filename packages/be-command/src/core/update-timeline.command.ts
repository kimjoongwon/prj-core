import type { UpdateTimelineDto } from "@cocrepo/dto";

export class UpdateTimelineCommand {
	constructor(
		readonly timelineId: string,
		readonly dto: UpdateTimelineDto,
	) {}
}
