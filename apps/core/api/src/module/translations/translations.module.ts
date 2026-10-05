import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import { TranslationsController } from "@cocrepo/controller";
import { TranslationsRepository } from "@cocrepo/repository";
import {
	TranslationCommandHandlers,
	TranslationQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
