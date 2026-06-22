import type { UpdateTemplateCommandInput } from "@cocrepo/input";
export class UpdateTemplateCommand implements UpdateTemplateCommandInput {
	readonly name?: UpdateTemplateCommandInput["name"];
	readonly description?: UpdateTemplateCommandInput["description"];
	readonly subject?: UpdateTemplateCommandInput["subject"];
	readonly content?: UpdateTemplateCommandInput["content"];
	readonly variables?: UpdateTemplateCommandInput["variables"];

	constructor(
		readonly templateId: string,
		input: UpdateTemplateCommandInput,
	) {
		Object.assign(this, input);
	}
}
