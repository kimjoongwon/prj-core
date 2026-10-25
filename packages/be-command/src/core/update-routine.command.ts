import type { UpdateRoutineCommandInput } from "@cocrepo/input";
export class UpdateRoutineCommand implements UpdateRoutineCommandInput {
	readonly activities?: UpdateRoutineCommandInput["activities"];
	readonly name?: UpdateRoutineCommandInput["name"];
	readonly label?: UpdateRoutineCommandInput["label"];

	constructor(
		readonly routineId: string,
		input: UpdateRoutineCommandInput,
	) {
		Object.assign(this, input);
	}
}
