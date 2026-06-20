import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { PublishServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(PublishServiceDocumentCommand)
export class PublishServiceDocumentUseCase
	implements ICommandHandler<PublishServiceDocumentCommand>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: PublishServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.publish(command.serviceDocumentId);
	}
}
