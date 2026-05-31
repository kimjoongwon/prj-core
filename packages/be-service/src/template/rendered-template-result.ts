import type { TemplateType } from "@cocrepo/prisma";

export interface RenderedTemplateResult {
	type: TemplateType;
	subject: string | null;
	content: string;
	unresolvedVariables: string[];
}
