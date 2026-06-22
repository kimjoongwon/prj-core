import type { FillInquiryFormCommandInput } from "@cocrepo/input";

export class FillInquiryFormWithAiQuery implements FillInquiryFormCommandInput {
	readonly mode!: FillInquiryFormCommandInput["mode"];
	readonly schemaKey!: FillInquiryFormCommandInput["schemaKey"];
	readonly selectedPaths!: FillInquiryFormCommandInput["selectedPaths"];
	readonly currentObject!: FillInquiryFormCommandInput["currentObject"];
	readonly userPrompt?: FillInquiryFormCommandInput["userPrompt"];

	constructor(input: FillInquiryFormCommandInput) {
		Object.assign(this, input);
	}
}
