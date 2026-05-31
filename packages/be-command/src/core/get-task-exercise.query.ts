import type { SpaceScope } from "@cocrepo/dto";

export class GetTaskExerciseQuery {
	constructor(
		readonly taskId: string,
		readonly spaceId: string,
		readonly spaceScope?: SpaceScope,
	) {}
}
