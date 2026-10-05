import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { UpdateServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateServiceDocumentCommand)
export class UpdateServiceDocumentUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: UpdateServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.update(
			command.serviceDocumentId,
			command,
		);
	}
}
