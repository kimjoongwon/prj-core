import { TemplatesRepository } from "@cocrepo/repository";
import { TemplatesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";

@Module({
	controllers: [TemplatesController],
	providers: [
		// Services
		TemplatesService,
		// Repositories
		TemplatesRepository,
	],
	exports: [TemplatesService],
})
export class TemplatesModule {}
