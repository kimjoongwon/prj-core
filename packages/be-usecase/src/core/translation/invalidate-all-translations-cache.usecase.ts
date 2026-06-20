import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { InvalidateAllTranslationsCacheCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateAllTranslationsCacheCommand)
export class InvalidateAllTranslationsCacheUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(): Promise<void> {
		return this.translationCatalogService.invalidateAllCache();
	}
}
