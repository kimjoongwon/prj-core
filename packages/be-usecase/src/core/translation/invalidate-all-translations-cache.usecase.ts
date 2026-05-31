import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { InvalidateAllTranslationsCacheCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateAllTranslationsCacheCommand)
export class InvalidateAllTranslationsCacheUseCase
	implements ICommandHandler<InvalidateAllTranslationsCacheCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregateRoot,
	) {}

	execute(): Promise<void> {
		return this.translationCatalogService.invalidateAllCache();
	}
}
