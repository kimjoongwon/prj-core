import type { LanguageCode } from "@cocrepo/constant";

/**
 * Translations Service Input Types
 */
export interface CreateTranslationInput {
	key: string;
	text: string;
	languageCode: LanguageCode;
	category?: string | null;
	isTranslated?: boolean;
}

export interface UpdateTranslationInput {
	key?: string;
	text?: string;
	languageCode?: LanguageCode;
	category?: string | null;
	isTranslated?: boolean;
}

export interface UpsertTranslationInput {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category?: string | null;
	isTranslated?: boolean;
}
