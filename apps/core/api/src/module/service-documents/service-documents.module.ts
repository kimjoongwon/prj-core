import { ServiceDocumentsRepository } from "@cocrepo/repository";
import { ServiceDocumentAggregateRoot } from "@cocrepo/aggregate";
import {
	ServiceDocumentCommandHandlers,
	ServiceDocumentQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ServiceDocumentsController } from "./service-documents.controller";

@Module({
	imports: [CqrsModule],
	controllers: [ServiceDocumentsController],
	providers: [
		ServiceDocumentAggregateRoot,
		ServiceDocumentsRepository,
		...ServiceDocumentCommandHandlers,
		...ServiceDocumentQueryHandlers,
	],
})
export class ServiceDocumentsModule {}
