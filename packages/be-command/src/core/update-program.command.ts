import type { UpdateProgramCommandInput } from "./update-program.input";
export class UpdateProgramCommand {
	constructor(
		readonly sessionId: string,
		readonly programId: string,
		readonly input: UpdateProgramCommandInput,
	) {}
}
