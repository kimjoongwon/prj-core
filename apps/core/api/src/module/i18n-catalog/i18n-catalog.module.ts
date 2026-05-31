import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import { TranslationQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { I18nCatalogController } from "./i18n-catalog.controller";

@Module({
	imports: [CqrsModule],
	controllers: [I18nCatalogController],
	providers: [
		TranslationCatalogAggregateRoot,
		TranslationsRepository,
		...TranslationQueryHandlers,
	],
})
export class I18nCatalogModule {}
