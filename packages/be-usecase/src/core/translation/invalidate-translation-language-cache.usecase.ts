import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { InvalidateTranslationLanguageCacheCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateTranslationLanguageCacheCommand)
export class InvalidateTranslationLanguageCacheUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: InvalidateTranslationLanguageCacheCommand): Promise<void> {
		return this.translationCatalogService.invalidateLanguageCache(
			command.languageCode,
		);
	}
}
