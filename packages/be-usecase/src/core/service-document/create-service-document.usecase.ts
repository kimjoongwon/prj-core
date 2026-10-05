import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { CreateServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateServiceDocumentCommand)
export class CreateServiceDocumentUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: CreateServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.create(command);
	}
}
