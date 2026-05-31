import type { CreateSessionDto } from "@cocrepo/dto";

export class CreateSessionCommand {
	constructor(
		readonly timelineId: string,
		readonly dto: CreateSessionDto,
	) {}
}
