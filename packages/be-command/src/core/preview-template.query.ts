import type { PreviewTemplateQueryInput } from "@cocrepo/input";

export class PreviewTemplateQuery {
	constructor(
		readonly templateSeq: bigint,
		readonly dto: PreviewTemplateQueryInput,
	) {}
}
