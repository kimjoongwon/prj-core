import type { UpdateExerciseDto } from "@cocrepo/dto";

export class UpdateTaskExerciseCommand {
	constructor(
		readonly taskId: string,
		readonly dto: UpdateExerciseDto,
		readonly spaceId: string,
	) {}
}
