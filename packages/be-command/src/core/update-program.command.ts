import type { UpdateProgramCommandInput } from "@cocrepo/input";
export class UpdateProgramCommand implements UpdateProgramCommandInput {
	readonly name?: UpdateProgramCommandInput["name"];
	readonly routineSeq?: UpdateProgramCommandInput["routineSeq"];
	readonly instructorSeq?: UpdateProgramCommandInput["instructorSeq"];
	readonly capacity?: UpdateProgramCommandInput["capacity"];
	readonly level?: UpdateProgramCommandInput["level"];

	constructor(
		readonly sessionSeq: bigint,
		readonly programSeq: bigint,
		input: UpdateProgramCommandInput,
	) {
		Object.assign(this, input);
	}
}
