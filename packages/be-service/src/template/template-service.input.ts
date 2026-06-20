import type { Prisma, TemplateType } from "@cocrepo/prisma";

export interface GetTemplatesInput {
	where: Prisma.TemplateWhereInput;
	orderBy: Record<string, "asc" | "desc">[];
	skip?: number;
	take?: number;
}

export interface TemplateVariableInput {
	name: string;
	description?: string;
	defaultValue?: string;
	isRequired?: boolean;
}

export interface CreateTemplateInput {
	code: string;
	name: string;
	type: TemplateType;
	subject?: string | null;
	content: string;
	description?: string | null;
	variables?: TemplateVariableInput[];
}

export interface UpdateTemplateInput {
	name?: string;
	subject?: string | null;
	content?: string;
	description?: string | null;
	variables?: TemplateVariableInput[] | null;
}

export interface PreviewTemplateInput {
	variables: Record<string, string>;
}

export interface SendTestTemplateInput {
	recipient: string;
	variables: Record<string, string>;
}
