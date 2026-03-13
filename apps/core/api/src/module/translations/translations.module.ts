import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationFacade } from "@cocrepo/facade";
import { RedisService, TranslationService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TranslationsController } from "./translations.controller";

@Module({
	controllers: [TranslationsController],
	providers: [
		TranslationsRepository,
		TranslationFacade,
		TranslationService,
		RedisService,
	],
	exports: [TranslationFacade],
})
export class TranslationsModule {}
