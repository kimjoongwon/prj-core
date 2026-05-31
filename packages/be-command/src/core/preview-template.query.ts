import type { PreviewTemplateDto } from "@cocrepo/dto";

export class PreviewTemplateQuery {
	constructor(
		readonly templateId: string,
		readonly dto: PreviewTemplateDto,
	) {}
}
