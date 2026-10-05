import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { UpdateTranslationCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTranslationCommand)
export class UpdateTranslationUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: UpdateTranslationCommand): Promise<unknown> {
		return this.translationCatalogService.update(
			command.translationId,
			command,
		);
	}
}
