import { TemplateFacade } from "@cocrepo/facade";
import { TemplatesRepository } from "@cocrepo/repository";
import { TemplateService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";

@Module({
	controllers: [TemplatesController],
	providers: [TemplateFacade, TemplateService, TemplatesRepository],
	exports: [TemplateFacade],
})
export class TemplatesModule {}
