import type { UpdateSpaceGroundCommandInput } from "@cocrepo/input";
export class UpdateSpaceGroundCommand implements UpdateSpaceGroundCommandInput {
	readonly contentLanguageCode?: UpdateSpaceGroundCommandInput["contentLanguageCode"];
	readonly name?: UpdateSpaceGroundCommandInput["name"];
	readonly label?: UpdateSpaceGroundCommandInput["label"];
	readonly address?: UpdateSpaceGroundCommandInput["address"];
	readonly phone?: UpdateSpaceGroundCommandInput["phone"];
	readonly email?: UpdateSpaceGroundCommandInput["email"];
	readonly businessNo?: UpdateSpaceGroundCommandInput["businessNo"];
	readonly logoImageFileId?: UpdateSpaceGroundCommandInput["logoImageFileId"];
	readonly imageFileId?: UpdateSpaceGroundCommandInput["imageFileId"];

	constructor(
		readonly spaceId: string,
		input: UpdateSpaceGroundCommandInput,
	) {
		Object.assign(this, input);
	}
}
