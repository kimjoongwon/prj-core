import type { UpdateFolderCommandInput } from "@cocrepo/input";
export class UpdateFolderCommand implements UpdateFolderCommandInput {
	readonly parentFolderId?: UpdateFolderCommandInput["parentFolderId"];
	readonly name?: UpdateFolderCommandInput["name"];

	constructor(
		readonly folderId: string,
		input: UpdateFolderCommandInput,
	) {
		Object.assign(this, input);
	}
}
