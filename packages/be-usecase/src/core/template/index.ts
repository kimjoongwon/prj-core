import { CreateTemplateUseCase } from "./create-template.usecase";
import { DeleteTemplateUseCase } from "./delete-template.usecase";
import { GetTemplateByIdUseCase } from "./get-template-by-id.usecase";
import { GetTemplatesUseCase } from "./get-templates.usecase";
import { PreviewTemplateUseCase } from "./preview-template.usecase";
import { SendTestTemplateUseCase } from "./send-test-template.usecase";
import { ToggleTemplateStatusUseCase } from "./toggle-template-status.usecase";
import { UpdateTemplateUseCase } from "./update-template.usecase";

export const TemplateQueryHandlers = [
	GetTemplatesUseCase,
	GetTemplateByIdUseCase,
	PreviewTemplateUseCase,
];

export const TemplateCommandHandlers = [
	CreateTemplateUseCase,
	UpdateTemplateUseCase,
	DeleteTemplateUseCase,
	ToggleTemplateStatusUseCase,
	SendTestTemplateUseCase,
];

export * from "./create-template.usecase";
export * from "./delete-template.usecase";
export * from "./get-template-by-id.usecase";
export * from "./get-templates.usecase";
export * from "./preview-template.usecase";
export * from "./send-test-template.usecase";
export * from "./toggle-template-status.usecase";
export * from "./update-template.usecase";
