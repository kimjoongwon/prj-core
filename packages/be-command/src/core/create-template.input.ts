import type { TemplateType } from "@cocrepo/prisma";

export interface TemplateVariableInput {
	name: string;
	description?: string;
	defaultValue?: string;
	isRequired?: boolean;
}

export interface CreateTemplateCommandInput {
	variables?: TemplateVariableInput[];
	name: string;
	description: string;
	type: TemplateType;
	code: string;
	subject: string;
	content: string;
}
