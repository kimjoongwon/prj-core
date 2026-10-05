import type { UpdateServiceDocumentCommandInput } from "@cocrepo/input";
export class UpdateServiceDocumentCommand
	implements UpdateServiceDocumentCommandInput
{
	readonly title?: UpdateServiceDocumentCommandInput["title"];
	readonly summary?: UpdateServiceDocumentCommandInput["summary"];
	readonly content?: UpdateServiceDocumentCommandInput["content"];
	readonly format?: UpdateServiceDocumentCommandInput["format"];
	readonly isRequired?: UpdateServiceDocumentCommandInput["isRequired"];
	readonly displayOrder?: UpdateServiceDocumentCommandInput["displayOrder"];
	readonly effectiveAt?: UpdateServiceDocumentCommandInput["effectiveAt"];

	constructor(
		readonly serviceDocumentId: bigint,
		input: UpdateServiceDocumentCommandInput,
	) {
		Object.assign(this, input);
	}
}
