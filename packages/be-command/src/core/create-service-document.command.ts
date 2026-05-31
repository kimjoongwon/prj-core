import type { CreateServiceDocumentDto } from "@cocrepo/dto";

export class CreateServiceDocumentCommand {
	constructor(readonly dto: CreateServiceDocumentDto) {}
}
