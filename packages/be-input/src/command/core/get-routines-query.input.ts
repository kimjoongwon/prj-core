import type { LanguageCode } from "@cocrepo/prisma";
import type { SpaceScope } from "@cocrepo/type";

export interface GetRoutinesQueryInput {
	search?: string;
	spaceScope?: SpaceScope;
	contentLanguageCode?: LanguageCode;
	skip?: number;
	take?: number;
}
