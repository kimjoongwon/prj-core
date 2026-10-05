import type { LanguageCode } from "@cocrepo/prisma";

export class GetTranslationCatalogQuery {
	constructor(readonly languageCode: LanguageCode) {}
}
