import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { I18nCatalogController } from "./i18n-catalog.controller";

@Module({
	controllers: [I18nCatalogController],
	providers: [TranslationCatalogService, TranslationsRepository],
})
export class I18nCatalogModule {}
