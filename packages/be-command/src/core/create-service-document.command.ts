import type { CreateServiceDocumentCommandInput } from "@cocrepo/input";
export class CreateServiceDocumentCommand
	implements CreateServiceDocumentCommandInput
{
	readonly kind!: CreateServiceDocumentCommandInput["kind"];
	readonly platform?: CreateServiceDocumentCommandInput["platform"];
	readonly locale?: CreateServiceDocumentCommandInput["locale"];
	readonly title!: CreateServiceDocumentCommandInput["title"];
	readonly summary?: CreateServiceDocumentCommandInput["summary"];
	readonly content!: CreateServiceDocumentCommandInput["content"];
	readonly format?: CreateServiceDocumentCommandInput["format"];
	readonly version!: CreateServiceDocumentCommandInput["version"];
	readonly isRequired?: CreateServiceDocumentCommandInput["isRequired"];
	readonly displayOrder?: CreateServiceDocumentCommandInput["displayOrder"];
	readonly effectiveAt?: CreateServiceDocumentCommandInput["effectiveAt"];

	constructor(input: CreateServiceDocumentCommandInput) {
		Object.assign(this, input);
	}
}
