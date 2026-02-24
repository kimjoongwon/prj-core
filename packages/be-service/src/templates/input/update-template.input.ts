import type { TemplateVariableInput } from "./template-variable.input";

export interface UpdateTemplateInput {
	name?: string;
	subject?: string | null;
	content?: string;
	description?: string | null;
	variables?: TemplateVariableInput[];
}
