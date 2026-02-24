import type { TemplateType } from "@cocrepo/prisma";
import type { TemplateVariableInput } from "./template-variable.input";

export interface CreateTemplateInput {
	code: string;
	name: string;
	type: TemplateType;
	subject?: string | null;
	content: string;
	description?: string | null;
	variables?: TemplateVariableInput[];
}
