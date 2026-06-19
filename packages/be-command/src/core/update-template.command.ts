import type { UpdateTemplateCommandInput } from "./update-template.input";
export class UpdateTemplateCommand {
	constructor(
		readonly templateId: string,
		readonly input: UpdateTemplateCommandInput,
	) {}
}
