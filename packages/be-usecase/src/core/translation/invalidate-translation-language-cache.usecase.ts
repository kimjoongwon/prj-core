import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { InvalidateTranslationLanguageCacheCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateTranslationLanguageCacheCommand)
export class InvalidateTranslationLanguageCacheUseCase
	implements ICommandHandler<InvalidateTranslationLanguageCacheCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: InvalidateTranslationLanguageCacheCommand): Promise<void> {
		return this.translationCatalogService.invalidateLanguageCache(
			command.languageCode,
		);
	}
}
