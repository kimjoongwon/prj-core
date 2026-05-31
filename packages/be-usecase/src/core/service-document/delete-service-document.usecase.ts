import { ServiceDocumentAggregateRoot } from "@cocrepo/aggregate";
import { DeleteServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteServiceDocumentCommand)
export class DeleteServiceDocumentUseCase
	implements ICommandHandler<DeleteServiceDocumentCommand>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregateRoot,
	) {}

	async execute(command: DeleteServiceDocumentCommand): Promise<void> {
		await this.serviceDocumentService.remove(command.serviceDocumentId);
	}
}
