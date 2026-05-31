import type { UpdateRoutineDto } from "@cocrepo/dto";

export class UpdateRoutineCommand {
	constructor(
		readonly routineId: string,
		readonly dto: UpdateRoutineDto,
	) {}
}
