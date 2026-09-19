import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { TranslationsRepository } from "@cocrepo/repository";
import { I18nCatalogUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { I18nCatalogController } from "./i18n-catalog.controller";

@Module({
	imports: [CqrsModule],
	controllers: [I18nCatalogController],
	providers: [
		...I18nCatalogUseCaseProviders,
		TranslationCatalogAggregate,
		TranslationsRepository,
	],
})
export class I18nCatalogModule {}
