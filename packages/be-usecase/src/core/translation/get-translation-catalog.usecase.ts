import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetTranslationCatalogQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTranslationCatalogQuery)
export class GetTranslationCatalogUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetTranslationCatalogQuery): Promise<unknown> {
		return this.translationCatalogService.getCatalog(query.languageCode);
	}
}
