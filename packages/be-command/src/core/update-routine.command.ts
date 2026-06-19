import type { UpdateRoutineCommandInput } from "./update-routine.input";
export class UpdateRoutineCommand {
	constructor(
		readonly routineId: string,
		readonly input: UpdateRoutineCommandInput,
	) {}
}
