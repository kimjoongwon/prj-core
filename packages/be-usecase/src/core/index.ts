import { AbilityQueryHandlers } from "./ability";
import { AssetQueryHandlers } from "./asset";
import { CommunityCommandHandlers, CommunityQueryHandlers } from "./community";
import { FolderCommandHandlers, FolderQueryHandlers } from "./folder";
import { PolicyQueryHandlers } from "./policy";
import { RoleCommandHandlers, RoleQueryHandlers } from "./role";
import {
	RoleAssignmentCommandHandlers,
	RoleAssignmentQueryHandlers,
} from "./role-assignment";
import { TranslationQueryHandlers } from "./translation";
import { UserCommandHandlers, UserQueryHandlers } from "./user";

export const CoreQueryHandlers = [
	...AbilityQueryHandlers,
	...AssetQueryHandlers,
	...CommunityQueryHandlers,
	...FolderQueryHandlers,
	...PolicyQueryHandlers,
	...RoleAssignmentQueryHandlers,
	...RoleQueryHandlers,
	...TranslationQueryHandlers,
	...UserQueryHandlers,
];

export const CoreCommandHandlers = [
	...CommunityCommandHandlers,
	...FolderCommandHandlers,
	...RoleAssignmentCommandHandlers,
	...RoleCommandHandlers,
	...UserCommandHandlers,
];

export const CoreUseCaseProviders = [
	...CoreCommandHandlers,
	...CoreQueryHandlers,
];

export * from "./ability";
export * from "./asset";
export * from "./community";
export * from "./folder";
export * from "./policy";
export * from "./role";
export * from "./role-assignment";
export * from "./translation";
export * from "./user";
