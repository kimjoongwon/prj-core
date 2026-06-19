import type { CreateProgramCommandInput } from "./create-program.input";
export class CreateProgramCommand {
	constructor(
		readonly sessionId: string,
		readonly input: CreateProgramCommandInput,
	) {}
}
