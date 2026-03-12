import { TemplatesApplicationService } from "@cocrepo/app";
import { TemplatesService } from "@cocrepo/service";
import { TemplatesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";

@Module({
	controllers: [TemplatesController],
	providers: [
		TemplatesApplicationService,
		TemplatesService,
		TemplatesRepository,
	],
	exports: [TemplatesApplicationService],
})
export class TemplatesModule {}
