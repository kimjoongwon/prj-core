import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { DeleteTranslationCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteTranslationCommand)
export class DeleteTranslationUseCase
	implements ICommandHandler<DeleteTranslationCommand>
{
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	execute(command: DeleteTranslationCommand): Promise<void> {
		return this.translationCatalogService.remove(command.translationId);
	}
}
