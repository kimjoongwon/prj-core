import type { LanguageCode } from "@cocrepo/constant";

export interface UpdateTranslationInput {
	key?: string;
	text?: string;
	languageCode?: LanguageCode;
	category?: string | null;
	isTranslated?: boolean;
}
