import type { CreateGroundDto } from "@cocrepo/dto";

export class CreateSpaceCommand {
	constructor(readonly dto: CreateGroundDto) {}
}
