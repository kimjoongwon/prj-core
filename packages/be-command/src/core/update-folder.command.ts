import type { UpdateFolderCommandInput } from "@cocrepo/input";
export class UpdateFolderCommand implements UpdateFolderCommandInput {
	readonly parentFolderId?: UpdateFolderCommandInput["parentFolderId"];
	readonly name?: UpdateFolderCommandInput["name"];

	constructor(
		readonly folderId: bigint,
		input: UpdateFolderCommandInput,
	) {
		Object.assign(this, input);
	}
}
