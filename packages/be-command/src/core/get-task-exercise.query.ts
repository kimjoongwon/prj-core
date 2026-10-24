import type { SpaceScope } from "@cocrepo/type";

export class GetTaskExerciseQuery {
	constructor(
		readonly taskSeq: bigint,
		readonly spaceSeq: bigint,
		readonly spaceScope?: SpaceScope,
	) {}
}
