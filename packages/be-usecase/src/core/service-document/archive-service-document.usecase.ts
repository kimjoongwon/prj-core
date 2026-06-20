import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { ArchiveServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ArchiveServiceDocumentCommand)
export class ArchiveServiceDocumentUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: ArchiveServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.archive(command.serviceDocumentId);
	}
}
