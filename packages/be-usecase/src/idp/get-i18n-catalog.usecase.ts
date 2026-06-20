import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetI18nCatalogQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetI18nCatalogQuery)
export class GetI18nCatalogUseCase
	implements IQueryHandler<GetI18nCatalogQuery>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetI18nCatalogQuery) {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
