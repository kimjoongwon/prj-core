import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { TranslationsRepository } from "@cocrepo/repository";
import {
	TranslationCommandHandlers,
	TranslationQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TranslationsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [TranslationsController],
	providers: [
		TranslationCatalogAggregate,
		TranslationsRepository,
		...TranslationCommandHandlers,
		...TranslationQueryHandlers,
	],
})
export class TranslationsModule {}
