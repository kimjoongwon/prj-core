import type { CreateTemplateDto } from "@cocrepo/dto";

export class CreateTemplateCommand {
	constructor(readonly dto: CreateTemplateDto) {}
}
