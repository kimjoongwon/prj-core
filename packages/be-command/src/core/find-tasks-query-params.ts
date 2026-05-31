import type { SpaceScope } from "@cocrepo/dto";
import type { LanguageCode } from "@cocrepo/prisma";

export interface FindTasksQueryParams {
	spaceId: string;
	spaceScope: SpaceScope;
	skip?: number;
	take?: number;
	search?: string;
	contentLanguageCode?: LanguageCode;
}
