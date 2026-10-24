import type { SpaceScope } from "@cocrepo/type";

export class GetRoutineByIdQuery {
	constructor(
		readonly routineSeq: bigint,
		readonly spaceScope?: SpaceScope,
	) {}
}
