import { TemplatesRepository } from "@cocrepo/repository";
import { TemplateService } from "@cocrepo/service";
import {
	TemplateCommandHandlers,
	TemplateQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TemplatesController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [TemplatesController],
	providers: [
		TemplateService,
		TemplatesRepository,
		...TemplateCommandHandlers,
		...TemplateQueryHandlers,
	],
})
export class TemplatesModule {}
