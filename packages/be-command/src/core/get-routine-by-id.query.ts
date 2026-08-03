import type { SpaceScope } from "@cocrepo/type";

export class GetRoutineByIdQuery {
	constructor(
		readonly routineId: bigint,
		readonly spaceScope?: SpaceScope,
	) {}
}
