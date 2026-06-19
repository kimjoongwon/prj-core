import type { UpdateTaskExerciseCommandInput } from "./update-task-exercise.input";
export class UpdateTaskExerciseCommand {
	constructor(
		readonly taskId: string,
		readonly input: UpdateTaskExerciseCommandInput,
		readonly spaceId: string,
	) {}
}
