import type { UpdateFolderCommandInput } from "@cocrepo/input";
export class UpdateFolderCommand implements UpdateFolderCommandInput {
	readonly parentFolderSeq?: UpdateFolderCommandInput["parentFolderSeq"];
	readonly name?: UpdateFolderCommandInput["name"];

	constructor(
		readonly folderSeq: bigint,
		input: UpdateFolderCommandInput,
	) {
		Object.assign(this, input);
	}
}
