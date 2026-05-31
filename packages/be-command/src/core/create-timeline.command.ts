import type { CreateTimelineDto } from "@cocrepo/dto";

export class CreateTimelineCommand {
	constructor(readonly dto: CreateTimelineDto) {}
}
