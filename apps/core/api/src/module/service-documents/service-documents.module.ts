import { ServiceDocumentFacade } from "@cocrepo/facade";
import { ServiceDocumentsRepository } from "@cocrepo/repository";
import { ServiceDocumentService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ServiceDocumentsController } from "./service-documents.controller";

@Module({
	controllers: [ServiceDocumentsController],
	providers: [
		ServiceDocumentFacade,
		ServiceDocumentService,
		ServiceDocumentsRepository,
	],
	exports: [ServiceDocumentFacade],
})
export class ServiceDocumentsModule {}
