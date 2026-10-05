import type { LanguageCode } from "@cocrepo/constant";

export interface CreateTranslationCommandInput {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category: string;
	isTranslated: boolean;
}
