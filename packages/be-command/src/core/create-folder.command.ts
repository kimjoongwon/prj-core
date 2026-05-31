import type { CreateFolderDto } from "@cocrepo/dto";

export class CreateFolderCommand {
	constructor(
		readonly dto: CreateFolderDto,
		readonly creatorId: string,
	) {}
}
