import type { LanguageCode } from "@cocrepo/prisma";

export interface CreateTranslationCommandInput {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category: string;
	isTranslated: boolean;
}
