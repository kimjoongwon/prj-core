import type { LanguageCode } from "@cocrepo/prisma";

export interface ListSpacesQueryInput {
	spaceIds?: bigint[];
	skip?: number;
	take?: number;
	search?: string;
	contentLanguageCode?: LanguageCode;
}
