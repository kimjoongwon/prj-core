import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { CreateTranslationCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTranslationCommand)
export class CreateTranslationUseCase {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: CreateTranslationCommand): Promise<unknown> {
		return this.translationCatalogService.create(command.input);
	}
}
