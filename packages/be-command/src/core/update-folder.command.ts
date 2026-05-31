import type { UpdateFolderDto } from "@cocrepo/dto";

export class UpdateFolderCommand {
	constructor(
		readonly folderId: string,
		readonly dto: UpdateFolderDto,
	) {}
}
