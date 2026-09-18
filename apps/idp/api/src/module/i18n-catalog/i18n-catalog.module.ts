import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { I18nCatalogController } from "./i18n-catalog.controller";
import { I18nCatalogUseCaseProviders } from "@cocrepo/usecase";

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
