import type { QueryServiceDocumentDto } from "@cocrepo/dto";

export class GetServiceDocumentsQuery {
	constructor(readonly query: QueryServiceDocumentDto) {}
}
