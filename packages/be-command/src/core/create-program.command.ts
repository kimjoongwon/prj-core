import type { CreateProgramDto } from "@cocrepo/dto";

export class CreateProgramCommand {
	constructor(
		readonly sessionId: string,
		readonly dto: CreateProgramDto,
	) {}
}
