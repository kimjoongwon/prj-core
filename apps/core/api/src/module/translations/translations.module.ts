import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationsApplicationService } from "@cocrepo/app";
import { RedisService, TranslationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TranslationsController } from "./translations.controller";

@Module({
	controllers: [TranslationsController],
	providers: [
		TranslationsRepository,
		TranslationsApplicationService,
		TranslationsService,
		RedisService,
	],
	exports: [TranslationsApplicationService],
})
export class TranslationsModule {}
