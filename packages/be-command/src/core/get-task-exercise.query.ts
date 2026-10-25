import type { SpaceScope } from "@cocrepo/type";

export class GetTaskExerciseQuery {
	constructor(
		readonly taskId: string,
		readonly spaceId: string,
		readonly spaceScope?: SpaceScope,
	) {}
}
