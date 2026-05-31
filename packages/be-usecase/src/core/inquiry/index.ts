import { AssignInquiryUseCase } from "./assign-inquiry.usecase";
import { CreateInquiryUseCase } from "./create-inquiry.usecase";
import { DeleteInquiryUseCase } from "./delete-inquiry.usecase";
import { FillInquiryFormWithAiUseCase } from "./fill-inquiry-form-with-ai.usecase";
import { GetInquiryByIdUseCase } from "./get-inquiry-by-id.usecase";
import { GetInquiryCreateFormBootstrapUseCase } from "./get-inquiry-create-form-bootstrap.usecase";
import { GetInquiryMessagesUseCase } from "./get-inquiry-messages.usecase";
import { GetInquiryParticipantsUseCase } from "./get-inquiry-participants.usecase";
import { GetInquiryStatsUseCase } from "./get-inquiry-stats.usecase";
import { GetInquiryUpdateFormBootstrapUseCase } from "./get-inquiry-update-form-bootstrap.usecase";
import { ListInquiriesUseCase } from "./list-inquiries.usecase";
import { UpdateInquiryUseCase } from "./update-inquiry.usecase";
import { UpdateInquiryPriorityUseCase } from "./update-inquiry-priority.usecase";
import { UpdateInquiryStatusUseCase } from "./update-inquiry-status.usecase";

export const InquiryQueryHandlers = [
	ListInquiriesUseCase,
	GetInquiryStatsUseCase,
	GetInquiryCreateFormBootstrapUseCase,
	GetInquiryUpdateFormBootstrapUseCase,
	FillInquiryFormWithAiUseCase,
	GetInquiryByIdUseCase,
	GetInquiryMessagesUseCase,
	GetInquiryParticipantsUseCase,
];

export const InquiryCommandHandlers = [
	CreateInquiryUseCase,
	UpdateInquiryUseCase,
	DeleteInquiryUseCase,
	AssignInquiryUseCase,
	UpdateInquiryStatusUseCase,
	UpdateInquiryPriorityUseCase,
];

export * from "./assign-inquiry.usecase";
export * from "./create-inquiry.usecase";
export * from "./delete-inquiry.usecase";
export * from "./fill-inquiry-form-with-ai.usecase";
export * from "./get-inquiry-by-id.usecase";
export * from "./get-inquiry-create-form-bootstrap.usecase";
export * from "./get-inquiry-messages.usecase";
export * from "./get-inquiry-participants.usecase";
export * from "./get-inquiry-stats.usecase";
export * from "./get-inquiry-update-form-bootstrap.usecase";
export * from "./list-inquiries.usecase";
export * from "./update-inquiry.usecase";
export * from "./update-inquiry-priority.usecase";
export * from "./update-inquiry-status.usecase";
