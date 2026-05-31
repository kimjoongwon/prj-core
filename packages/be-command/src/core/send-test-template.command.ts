import type { SendTestTemplateDto } from "@cocrepo/dto";

export class SendTestTemplateCommand {
	constructor(
		readonly templateId: string,
		readonly dto: SendTestTemplateDto,
	) {}
}
