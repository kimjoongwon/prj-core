import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { DeleteServiceDocumentCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteServiceDocumentCommand)
export class DeleteServiceDocumentUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	async execute(command: DeleteServiceDocumentCommand): Promise<void> {
		await this.serviceDocumentService.remove(command.serviceDocumentId);
	}
}
