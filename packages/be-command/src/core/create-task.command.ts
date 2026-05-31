import type { CreateExerciseDto } from "@cocrepo/dto";

export class CreateTaskCommand {
	constructor(
		readonly dto: CreateExerciseDto,
		readonly spaceId: string,
		readonly creatorId: string,
	) {}
}
