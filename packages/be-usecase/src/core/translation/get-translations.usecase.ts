import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { GetTranslationsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTranslationsQuery)
export class GetTranslationsUseCase
	implements IQueryHandler<GetTranslationsQuery>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregateRoot,
	) {}

	execute(query: GetTranslationsQuery): Promise<unknown> {
		return this.translationCatalogService.getTranslations(query.query);
	}
}
