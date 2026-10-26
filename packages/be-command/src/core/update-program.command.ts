import type { UpdateProgramCommandInput } from "@cocrepo/input";
export class UpdateProgramCommand implements UpdateProgramCommandInput {
	readonly name?: UpdateProgramCommandInput["name"];
	readonly routineId?: UpdateProgramCommandInput["routineId"];
	readonly instructorId?: UpdateProgramCommandInput["instructorId"];
	readonly capacity?: UpdateProgramCommandInput["capacity"];
	readonly level?: UpdateProgramCommandInput["level"];

	constructor(
		readonly sessionId: bigint,
		readonly programId: bigint,
		input: UpdateProgramCommandInput,
	) {
		Object.assign(this, input);
	}
}
