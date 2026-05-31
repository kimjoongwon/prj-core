import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { GetIdpI18nCatalogQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetIdpI18nCatalogQuery)
export class GetIdpI18nCatalogUseCase
	implements IQueryHandler<GetIdpI18nCatalogQuery>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregateRoot,
	) {}

	execute(query: GetIdpI18nCatalogQuery) {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
