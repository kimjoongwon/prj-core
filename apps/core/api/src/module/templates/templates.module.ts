import { TemplateFacade } from "@cocrepo/facade";
import { TemplateService } from "@cocrepo/service";
import { TemplatesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";

@Module({
	controllers: [TemplatesController],
	providers: [
		TemplateFacade,
		TemplateService,
		TemplatesRepository,
	],
	exports: [TemplateFacade],
})
export class TemplatesModule {}
