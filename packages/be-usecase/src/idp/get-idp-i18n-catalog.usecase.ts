import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetIdpI18nCatalogQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpI18nCatalogQuery)
export class GetIdpI18nCatalogUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetIdpI18nCatalogQuery) {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
