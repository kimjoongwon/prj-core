import { TranslationFacade } from "@cocrepo/facade";
import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TranslationsController } from "./translations.controller";

@Module({
	controllers: [TranslationsController],
	providers: [
		TranslationFacade,
		TranslationCatalogService,
		TranslationsRepository,
	],
	exports: [TranslationFacade],
})
export class TranslationsModule {}
