import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { ServiceDocumentsController } from "@cocrepo/controller";
import { ServiceDocumentsRepository } from "@cocrepo/repository";
import {
	ServiceDocumentCommandHandlers,
	ServiceDocumentQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [ServiceDocumentsController],
	providers: [
		ServiceDocumentAggregate,
		ServiceDocumentsRepository,
		...ServiceDocumentCommandHandlers,
		...ServiceDocumentQueryHandlers,
	],
})
export class ServiceDocumentsModule {}
