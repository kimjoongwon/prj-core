import type { LanguageCode } from "@cocrepo/prisma";

export interface GetTimelinesQueryInput {
	timelineId?: string | null;
	search?: string | null;
	contentLanguageCode?: LanguageCode;
	sort?: string[];
	skip?: number;
	take?: number;
}
