import { ApproveTenantAccessRequestUseCase } from "./approve-tenant-access-request.usecase";
import { GetTenantAccessRequestForReviewUseCase } from "./get-tenant-access-request-for-review.usecase";
import { ListTenantAccessRequestsForReviewUseCase } from "./list-tenant-access-requests-for-review.usecase";
import { RejectTenantAccessRequestUseCase } from "./reject-tenant-access-request.usecase";

export const TenantAccessRequestQueryHandlers = [
	ListTenantAccessRequestsForReviewUseCase,
	GetTenantAccessRequestForReviewUseCase,
];

export const TenantAccessRequestCommandHandlers = [
	ApproveTenantAccessRequestUseCase,
	RejectTenantAccessRequestUseCase,
];

export * from "./approve-tenant-access-request.usecase";
export * from "./get-tenant-access-request-for-review.usecase";
export * from "./list-tenant-access-requests-for-review.usecase";
export * from "./reject-tenant-access-request.usecase";
