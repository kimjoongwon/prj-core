import type { SpaceScope } from "@cocrepo/type";

export class GetTaskExerciseQuery {
	constructor(
		readonly taskId: bigint,
		readonly spaceId: bigint,
		readonly spaceScope?: SpaceScope,
	) {}
}
