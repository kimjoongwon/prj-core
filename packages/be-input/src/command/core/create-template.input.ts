import type { TemplateType } from "@cocrepo/prisma";

export interface TemplateCommandVariableInput {
	name: string;
	description?: string;
	defaultValue?: string;
	isRequired?: boolean;
}

export interface CreateTemplateCommandInput {
	variables?: TemplateCommandVariableInput[];
	name: string;
	description: string;
	type: TemplateType;
	code: string;
	subject: string;
	content: string;
}
