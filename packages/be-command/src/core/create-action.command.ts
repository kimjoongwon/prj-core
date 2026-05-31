import type { CreateActionDto } from "@cocrepo/dto";

export class CreateActionCommand {
	constructor(readonly dto: CreateActionDto) {}
}
