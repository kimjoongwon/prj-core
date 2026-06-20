import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { UpdateTranslationCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTranslationCommand)
export class UpdateTranslationUseCase
	implements ICommandHandler<UpdateTranslationCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: UpdateTranslationCommand): Promise<unknown> {
		return this.translationCatalogService.update(
			command.translationId,
			command.input,
		);
	}
}
