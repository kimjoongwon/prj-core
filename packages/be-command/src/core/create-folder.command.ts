import type { CreateFolderCommandInput } from "@cocrepo/input";
export class CreateFolderCommand implements CreateFolderCommandInput {
	readonly parentFolderId?: CreateFolderCommandInput["parentFolderId"];
	readonly name!: CreateFolderCommandInput["name"];

	constructor(
		input: CreateFolderCommandInput,
		readonly createdById: string,
	) {
		Object.assign(this, input);
	}
}
