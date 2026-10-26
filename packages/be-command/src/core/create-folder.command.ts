import type { CreateFolderCommandInput } from "@cocrepo/input";
export class CreateFolderCommand implements CreateFolderCommandInput {
	readonly parentFolderId?: CreateFolderCommandInput["parentFolderId"];
	readonly name!: CreateFolderCommandInput["name"];

	constructor(
		input: CreateFolderCommandInput,
		readonly createdById: bigint,
	) {
		Object.assign(this, input);
	}
}
