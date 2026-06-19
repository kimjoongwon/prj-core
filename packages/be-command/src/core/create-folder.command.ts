import type { CreateFolderCommandInput } from "./create-folder.input";
export class CreateFolderCommand {
	constructor(
		readonly input: CreateFolderCommandInput,
		readonly creatorId: string,
	) {}
}
