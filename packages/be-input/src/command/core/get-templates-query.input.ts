import type { TemplateType } from "@cocrepo/prisma";

export interface GetTemplatesQueryInput {
	search?: string;
	type?: TemplateType;
	isActive?: boolean;
	sort?: string[];
	skip?: number;
	take?: number;
}
