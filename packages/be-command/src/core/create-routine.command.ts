import type { CreateRoutineDto } from "@cocrepo/dto";

export class CreateRoutineCommand {
	constructor(readonly dto: CreateRoutineDto) {}
}
