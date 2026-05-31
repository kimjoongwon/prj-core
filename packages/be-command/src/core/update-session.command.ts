import type { UpdateSessionDto } from "@cocrepo/dto";

export class UpdateSessionCommand {
	constructor(
		readonly timelineId: string,
		readonly sessionId: string,
		readonly dto: UpdateSessionDto,
	) {}
}
