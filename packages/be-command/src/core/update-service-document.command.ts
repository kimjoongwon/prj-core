import type { UpdateServiceDocumentDto } from "@cocrepo/dto";

export class UpdateServiceDocumentCommand {
	constructor(
		readonly serviceDocumentId: string,
		readonly dto: UpdateServiceDocumentDto,
	) {}
}
