import type { LanguageCode } from "@cocrepo/prisma";

export interface UpdateSpaceGroundCommandInput {
	contentLanguageCode?: LanguageCode;
	name?: string;
	spaceId?: string;
	label?: string;
	address?: string;
	phone?: string;
	email?: string;
	businessNo?: string;
	logoImageFileId?: string;
	imageFileId?: string;
}
