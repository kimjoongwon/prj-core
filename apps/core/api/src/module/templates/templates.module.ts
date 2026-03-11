import { TemplatesApplicationService } from "@cocrepo/app";
import { TemplatesRepository } from "@cocrepo/repository";
import { TemplatesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";

@Module({
	controllers: [TemplatesController],
	providers: [
		TemplatesApplicationService,
		// Services
		TemplatesService,
		// Repositories
		TemplatesRepository,
	],
	exports: [TemplatesApplicationService],
})
export class TemplatesModule {}
