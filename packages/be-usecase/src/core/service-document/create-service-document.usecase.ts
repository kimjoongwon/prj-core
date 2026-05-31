import { ServiceDocumentAggregateRoot } from "@cocrepo/aggregate";
import { CreateServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateServiceDocumentCommand)
export class CreateServiceDocumentUseCase
	implements ICommandHandler<CreateServiceDocumentCommand>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregateRoot,
	) {}

	execute(command: CreateServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.create(command.dto);
	}
}
