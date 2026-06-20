import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { I18nCatalogController } from "@cocrepo/controller";
import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [I18nCatalogController],
	providers: [
		TranslationCatalogAggregate,
		TranslationsRepository,
		...TranslationQueryHandlers,
	],
})
export class I18nCatalogModule {}
