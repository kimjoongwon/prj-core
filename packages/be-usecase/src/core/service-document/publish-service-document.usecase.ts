import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { PublishServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(PublishServiceDocumentCommand)
export class PublishServiceDocumentUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: PublishServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.publish(command.serviceDocumentId);
	}
}
