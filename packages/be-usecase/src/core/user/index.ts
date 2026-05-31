import { GetUserDetailForSpaceUseCase } from "./get-user-detail-for-space.usecase";
import { GetUsersBySpaceUseCase } from "./get-users-by-space.usecase";

export const UserQueryHandlers = [
	GetUsersBySpaceUseCase,
	GetUserDetailForSpaceUseCase,
];

export const UserCommandHandlers = [];

export * from "./get-user-detail-for-space.usecase";
export * from "./get-users-by-space.usecase";
