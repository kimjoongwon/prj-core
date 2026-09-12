import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetI18nCatalogQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import type { I18nCatalogResult } from "./i18n-catalog.result";

@QueryHandler(GetI18nCatalogQuery)
export class GetI18nCatalogUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetI18nCatalogQuery): Promise<I18nCatalogResult> {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
