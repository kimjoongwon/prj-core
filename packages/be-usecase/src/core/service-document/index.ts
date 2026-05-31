import { ArchiveServiceDocumentUseCase } from "./archive-service-document.usecase";
import { CreateServiceDocumentUseCase } from "./create-service-document.usecase";
import { DeleteServiceDocumentUseCase } from "./delete-service-document.usecase";
import { GetServiceDocumentsUseCase } from "./get-service-documents.usecase";
import { PublishServiceDocumentUseCase } from "./publish-service-document.usecase";
import { UpdateServiceDocumentUseCase } from "./update-service-document.usecase";

export const ServiceDocumentQueryHandlers = [GetServiceDocumentsUseCase];

export const ServiceDocumentCommandHandlers = [
	CreateServiceDocumentUseCase,
	UpdateServiceDocumentUseCase,
	PublishServiceDocumentUseCase,
	ArchiveServiceDocumentUseCase,
	DeleteServiceDocumentUseCase,
];

export * from "./archive-service-document.usecase";
export * from "./create-service-document.usecase";
export * from "./delete-service-document.usecase";
export * from "./get-service-documents.usecase";
export * from "./publish-service-document.usecase";
export * from "./update-service-document.usecase";
