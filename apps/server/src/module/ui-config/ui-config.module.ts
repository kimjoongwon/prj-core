import { UIConfigRepository } from "@cocrepo/repository";
import { UIConfigService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UIConfigController } from "./ui-config.controller";

@Module({
	controllers: [UIConfigController],
	providers: [
		// Service
		UIConfigService,
		// Repository
		UIConfigRepository,
	],
})
export class UIConfigModule {}
