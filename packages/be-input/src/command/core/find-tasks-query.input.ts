import type { LanguageCode } from "@cocrepo/prisma";
import type { SpaceScope } from "@cocrepo/type";

export interface FindTasksQueryInput {
	spaceId: string;
	spaceScope: SpaceScope;
	skip?: number;
	take?: number;
	search?: string;
	contentLanguageCode?: LanguageCode;
}
