import type { LanguageCode } from "@cocrepo/constant";

export interface I18nCatalogResult {
	languageCode: LanguageCode;
	messages: Record<string, string>;
}
