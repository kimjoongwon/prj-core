import { TranslationsApplicationService } from "@cocrepo/app";
import { TranslationsRepository } from "@cocrepo/repository";
import { RedisService, TranslationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TranslationsController } from "./translations.controller";

@Module({
	controllers: [TranslationsController],
	providers: [
		TranslationsRepository,
		TranslationsService,
		TranslationsApplicationService,
		RedisService,
	],
	exports: [TranslationsApplicationService],
})
export class TranslationsModule {}
