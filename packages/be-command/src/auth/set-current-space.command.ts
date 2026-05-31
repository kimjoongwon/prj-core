import type { SetCurrentSpaceDto } from "@cocrepo/dto";

export class SetCurrentSpaceCommand {
	constructor(readonly dto: SetCurrentSpaceDto) {}
}
