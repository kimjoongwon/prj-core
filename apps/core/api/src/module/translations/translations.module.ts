import { TranslationsRepository } from "@cocrepo/repository";
import { TranslationCatalogAggregateRoot } from "@cocrepo/aggregate";
import {
	TranslationCommandHandlers,
	TranslationQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TranslationsController } from "./translations.controller";

@Module({
	imports: [CqrsModule],
	controllers: [TranslationsController],
	providers: [
		TranslationCatalogAggregateRoot,
		TranslationsRepository,
		...TranslationCommandHandlers,
		...TranslationQueryHandlers,
	],
})
export class TranslationsModule {}
