import type { SpaceScope } from "@cocrepo/type";

export class GetRoutineByIdQuery {
	constructor(
		readonly routineId: string,
		readonly spaceScope?: SpaceScope,
	) {}
}
