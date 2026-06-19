import type { UpdateFolderCommandInput } from "./update-folder.input";
export class UpdateFolderCommand {
	constructor(
		readonly folderId: string,
		readonly input: UpdateFolderCommandInput,
	) {}
}
