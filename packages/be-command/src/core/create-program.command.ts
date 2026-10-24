import type { CreateProgramCommandInput } from "@cocrepo/input";
export class CreateProgramCommand implements CreateProgramCommandInput {
	readonly name!: CreateProgramCommandInput["name"];
	readonly routineSeq!: CreateProgramCommandInput["routineSeq"];
	readonly instructorSeq!: CreateProgramCommandInput["instructorSeq"];
	readonly capacity!: CreateProgramCommandInput["capacity"];
	readonly level?: CreateProgramCommandInput["level"];

	constructor(
		readonly sessionSeq: bigint,
		input: CreateProgramCommandInput,
	) {
		Object.assign(this, input);
	}
}
