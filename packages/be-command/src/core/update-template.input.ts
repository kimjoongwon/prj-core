import type { TemplateVariableInput } from "./create-template.input";

export interface UpdateTemplateCommandInput {
	name?: string;
	description?: string;
	subject?: string;
	content?: string;
	variables?: TemplateVariableInput[];
}
