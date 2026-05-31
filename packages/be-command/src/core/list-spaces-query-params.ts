import type { LanguageCode } from "@cocrepo/prisma";

export interface ListSpacesQueryParams {
	spaceIds?: string[];
	skip?: number;
	take?: number;
	search?: string;
	contentLanguageCode?: LanguageCode;
}
