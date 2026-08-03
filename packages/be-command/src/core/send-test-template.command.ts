import type { SendTestTemplateCommandInput } from "@cocrepo/input";
export class SendTestTemplateCommand implements SendTestTemplateCommandInput {
	readonly recipient!: SendTestTemplateCommandInput["recipient"];
	readonly variables!: SendTestTemplateCommandInput["variables"];

	constructor(
		readonly templateId: bigint,
		input: SendTestTemplateCommandInput,
	) {
		Object.assign(this, input);
	}
}
