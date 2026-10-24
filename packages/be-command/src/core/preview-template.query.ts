import type { PreviewTemplateQueryInput } from "@cocrepo/input";

export class PreviewTemplateQuery {
	constructor(
		readonly templateId: string,
		readonly dto: PreviewTemplateQueryInput,
	) {}
}
