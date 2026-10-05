import type { LanguageCode } from "@cocrepo/constant";

export interface GetTranslationsQueryInput {
	languageCode?: LanguageCode;
	category?: string;
	isTranslated?: boolean;
	key?: string;
	page?: number;
	limit?: number;
}
