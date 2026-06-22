import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { GetTranslationsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTranslationsQuery)
export class GetTranslationsUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(query: GetTranslationsQuery): Promise<unknown> {
		return this.translationCatalogService.getTranslations(query);
	}
}
