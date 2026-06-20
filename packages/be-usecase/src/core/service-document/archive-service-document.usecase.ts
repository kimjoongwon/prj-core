import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { ArchiveServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ArchiveServiceDocumentCommand)
export class ArchiveServiceDocumentUseCase
	implements ICommandHandler<ArchiveServiceDocumentCommand>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	execute(command: ArchiveServiceDocumentCommand): Promise<unknown> {
		return this.serviceDocumentService.archive(command.serviceDocumentId);
	}
}
