import type { UpdateActionDto } from "@cocrepo/dto";

export class UpdateActionCommand {
	constructor(
		readonly actionId: string,
		readonly dto: UpdateActionDto,
	) {}
}
