import type { UpdateTemplateDto } from "@cocrepo/dto";

export class UpdateTemplateCommand {
	constructor(
		readonly templateId: string,
		readonly dto: UpdateTemplateDto,
	) {}
}
