import type { LanguageCode } from "@cocrepo/prisma";

export interface UpdateSpaceGroundCommandInput {
	contentLanguageCode?: LanguageCode;
	name?: string;
	label?: string | null;
	address?: string;
	phone?: string;
	email?: string;
	businessNo?: string;
	logoImageFileId?: string;
	imageFileId?: string;
}
