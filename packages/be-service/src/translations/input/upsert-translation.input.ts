import type { LanguageCode } from "@cocrepo/constant";

export interface UpsertTranslationInput {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category?: string | null;
	isTranslated?: boolean;
}
