import type { CreateFolderCommandInput } from "@cocrepo/input";
export class CreateFolderCommand implements CreateFolderCommandInput {
	readonly parentFolderSeq?: CreateFolderCommandInput["parentFolderSeq"];
	readonly name!: CreateFolderCommandInput["name"];

	constructor(
		input: CreateFolderCommandInput,
		readonly createdBySeq: bigint,
	) {
		Object.assign(this, input);
	}
}
