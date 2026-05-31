import type { UpdateGroundDto } from "@cocrepo/dto";

export class UpdateSpaceGroundCommand {
	constructor(
		readonly spaceId: string,
		readonly dto: UpdateGroundDto,
	) {}
}
