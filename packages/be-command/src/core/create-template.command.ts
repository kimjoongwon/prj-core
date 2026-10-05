import type { CreateTemplateCommandInput } from "@cocrepo/input";
export class CreateTemplateCommand implements CreateTemplateCommandInput {
	readonly variables?: CreateTemplateCommandInput["variables"];
	readonly name!: CreateTemplateCommandInput["name"];
	readonly description!: CreateTemplateCommandInput["description"];
	readonly type!: CreateTemplateCommandInput["type"];
	readonly code!: CreateTemplateCommandInput["code"];
	readonly subject!: CreateTemplateCommandInput["subject"];
	readonly content!: CreateTemplateCommandInput["content"];

	constructor(input: CreateTemplateCommandInput) {
		Object.assign(this, input);
	}
}
