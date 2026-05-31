import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { I18nCatalogController } from "./i18n-catalog.controller";
import { IdpI18nCatalogUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [I18nCatalogController],
	providers: [
		...IdpI18nCatalogUseCaseProviders,
		TranslationCatalogAggregateRoot,
		TranslationsRepository,
	],
})
export class I18nCatalogModule {}
