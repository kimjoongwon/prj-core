import type { UpdateServiceDocumentCommandInput } from "./update-service-document.input";
export class UpdateServiceDocumentCommand {
	constructor(
		readonly serviceDocumentId: string,
		readonly input: UpdateServiceDocumentCommandInput,
	) {}
}
