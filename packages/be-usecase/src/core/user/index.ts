import { GetUserDetailForSpaceUseCase } from "./get-user-detail-for-space.usecase";
import { GetUserTenantDetailUseCase } from "./get-user-tenant-detail.usecase";
import { GetUsersBySpaceUseCase } from "./get-users-by-space.usecase";

export const UserQueryHandlers = [
	GetUsersBySpaceUseCase,
	GetUserDetailForSpaceUseCase,
	GetUserTenantDetailUseCase,
];

export const UserCommandHandlers = [];

export * from "./get-user-detail-for-space.usecase";
export * from "./get-user-tenant-detail.usecase";
export * from "./get-users-by-space.usecase";
