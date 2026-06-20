import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { UpdateServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateServiceDocumentCommand)
export class UpdateServiceDocumentUseCase
	implements ICommandHandler<UpdateServiceDocumentCommand>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: UpdateServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.update(
			command.serviceDocumentId,
			command.input,
		);
	}
}
