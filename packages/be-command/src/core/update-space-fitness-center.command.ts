import type { UpdateSpaceFitnessCenterCommandInput } from "@cocrepo/input";

/**
 * 피트니스 센터(스페이스) 수정 커맨드 메시지입니다.
 */
export class UpdateSpaceFitnessCenterCommand
	implements UpdateSpaceFitnessCenterCommandInput
{
	readonly contentLanguageCode?: UpdateSpaceFitnessCenterCommandInput["contentLanguageCode"];
	readonly name?: UpdateSpaceFitnessCenterCommandInput["name"];
	readonly label?: UpdateSpaceFitnessCenterCommandInput["label"];
	readonly address?: UpdateSpaceFitnessCenterCommandInput["address"];
	readonly phone?: UpdateSpaceFitnessCenterCommandInput["phone"];
	readonly email?: UpdateSpaceFitnessCenterCommandInput["email"];
	readonly imageFileId?: UpdateSpaceFitnessCenterCommandInput["imageFileId"];

	constructor(
		readonly spaceId: string,
		input: UpdateSpaceFitnessCenterCommandInput,
	) {
		Object.assign(this, input);
	}
}
