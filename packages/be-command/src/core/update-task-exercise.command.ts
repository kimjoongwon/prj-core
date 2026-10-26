import type { UpdateTaskExerciseCommandInput } from "@cocrepo/input";
export class UpdateTaskExerciseCommand
	implements UpdateTaskExerciseCommandInput
{
	readonly name?: UpdateTaskExerciseCommandInput["name"];
	readonly description?: UpdateTaskExerciseCommandInput["description"];
	readonly imageFileId?: UpdateTaskExerciseCommandInput["imageFileId"];
	readonly duration?: UpdateTaskExerciseCommandInput["duration"];
	readonly count?: UpdateTaskExerciseCommandInput["count"];
	readonly videoFileId?: UpdateTaskExerciseCommandInput["videoFileId"];

	constructor(
		readonly taskId: bigint,
		input: UpdateTaskExerciseCommandInput,
		readonly spaceId: bigint,
	) {
		Object.assign(this, input);
	}
}
