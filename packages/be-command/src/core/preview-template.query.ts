import type { PreviewTemplateQueryInput } from "@cocrepo/input";

export class PreviewTemplateQuery {
	constructor(
		readonly templateId: bigint,
		readonly dto: PreviewTemplateQueryInput,
	) {}
}
