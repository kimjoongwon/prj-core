import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetTranslationsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTranslationsQuery)
export class GetTranslationsUseCase
	implements IQueryHandler<GetTranslationsQuery>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetTranslationsQuery): Promise<unknown> {
		return this.translationCatalogService.getTranslations(query.query);
	}
}
