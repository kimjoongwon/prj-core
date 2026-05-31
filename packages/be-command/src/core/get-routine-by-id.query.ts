import type { SpaceScope } from "@cocrepo/dto";

export class GetRoutineByIdQuery {
	constructor(
		readonly routineId: string,
		readonly spaceScope?: SpaceScope,
	) {}
}
