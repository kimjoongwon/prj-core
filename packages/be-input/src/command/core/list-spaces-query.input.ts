import type { LanguageCode } from "@cocrepo/prisma";

export interface ListSpacesQueryInput {
	spaceIds?: string[];
	skip?: number;
	take?: number;
	search?: string;
	contentLanguageCode?: LanguageCode;
}
