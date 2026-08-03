import type { CreateProgramCommandInput } from "@cocrepo/input";
export class CreateProgramCommand implements CreateProgramCommandInput {
	readonly name!: CreateProgramCommandInput["name"];
	readonly routineId!: CreateProgramCommandInput["routineId"];
	readonly instructorId!: CreateProgramCommandInput["instructorId"];
	readonly capacity!: CreateProgramCommandInput["capacity"];
	readonly level!: CreateProgramCommandInput["level"];

	constructor(
		readonly sessionId: bigint,
		input: CreateProgramCommandInput,
	) {
		Object.assign(this, input);
	}
}
