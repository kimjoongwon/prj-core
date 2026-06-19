import type { SendTestTemplateCommandInput } from "./send-test-template.input";
export class SendTestTemplateCommand {
	constructor(
		readonly templateId: string,
		readonly input: SendTestTemplateCommandInput,
	) {}
}
