import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { CreateTranslationCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTranslationCommand)
export class CreateTranslationUseCase
	implements ICommandHandler<CreateTranslationCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: CreateTranslationCommand): Promise<unknown> {
		return this.translationCatalogService.create(command.input);
	}
}
