import type { UpdateProgramDto } from "@cocrepo/dto";

export class UpdateProgramCommand {
	constructor(
		readonly sessionId: string,
		readonly programId: string,
		readonly dto: UpdateProgramDto,
	) {}
}
