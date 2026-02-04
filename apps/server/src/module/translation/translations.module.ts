import { TranslationsFacade } from "@cocrepo/facade";
import { TranslationsRepository } from "@cocrepo/repository";
import { RedisService, TranslationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TranslationsController } from "./translations.controller";

@Module({
	controllers: [TranslationsController],
	providers: [
		TranslationsRepository,
		TranslationsService,
		TranslationsFacade,
		RedisService,
	],
	exports: [TranslationsService, TranslationsFacade],
})
export class TranslationsModule {}
