import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetIdpI18nCatalogQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import type { I18nCatalogResult } from "./i18n-catalog.result";

@QueryHandler(GetIdpI18nCatalogQuery)
export class GetIdpI18nCatalogUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetIdpI18nCatalogQuery): Promise<I18nCatalogResult> {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
