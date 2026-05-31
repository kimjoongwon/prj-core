import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { InvalidateTranslationLanguageCacheCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateTranslationLanguageCacheCommand)
export class InvalidateTranslationLanguageCacheUseCase
	implements ICommandHandler<InvalidateTranslationLanguageCacheCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregateRoot,
	) {}

	execute(command: InvalidateTranslationLanguageCacheCommand): Promise<void> {
		return this.translationCatalogService.invalidateLanguageCache(
			command.languageCode,
		);
	}
}
