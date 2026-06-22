import type { CreateSpaceCommandInput } from "@cocrepo/input";
export class CreateSpaceCommand implements CreateSpaceCommandInput {
	readonly contentLanguageCode!: CreateSpaceCommandInput["contentLanguageCode"];
	readonly name!: CreateSpaceCommandInput["name"];
	readonly label!: CreateSpaceCommandInput["label"];
	readonly address!: CreateSpaceCommandInput["address"];
	readonly phone!: CreateSpaceCommandInput["phone"];
	readonly email!: CreateSpaceCommandInput["email"];
	readonly businessNo!: CreateSpaceCommandInput["businessNo"];
	readonly logoImageFileId!: CreateSpaceCommandInput["logoImageFileId"];
	readonly imageFileId!: CreateSpaceCommandInput["imageFileId"];

	constructor(input: CreateSpaceCommandInput) {
		Object.assign(this, input);
	}
}
