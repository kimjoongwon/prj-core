import { AbilityCommandHandlers, AbilityQueryHandlers } from "./ability";
import { ActionCommandHandlers, ActionQueryHandlers } from "./action";
import { AssetCommandHandlers, AssetQueryHandlers } from "./asset";
import { CommunityCommandHandlers, CommunityQueryHandlers } from "./community";
import { FolderCommandHandlers, FolderQueryHandlers } from "./folder";
import { InquiryCommandHandlers, InquiryQueryHandlers } from "./inquiry";
import { PolicyCommandHandlers, PolicyQueryHandlers } from "./policy";
import {
	PolicyAssignmentCommandHandlers,
	PolicyAssignmentQueryHandlers,
} from "./policy-assignment";
import { RoleCommandHandlers, RoleQueryHandlers } from "./role";
import { RoutineCommandHandlers, RoutineQueryHandlers } from "./routine";
import {
	ServiceDocumentCommandHandlers,
	ServiceDocumentQueryHandlers,
} from "./service-document";
import { SpaceCommandHandlers, SpaceQueryHandlers } from "./space";
import { SubjectCommandHandlers, SubjectQueryHandlers } from "./subject";
import { TaskCommandHandlers, TaskQueryHandlers } from "./task";
import { TemplateCommandHandlers, TemplateQueryHandlers } from "./template";
import {
	TenantAccessRequestCommandHandlers,
	TenantAccessRequestQueryHandlers,
} from "./tenant-access-request";
import { TimelineCommandHandlers, TimelineQueryHandlers } from "./timeline";
import {
	TranslationCommandHandlers,
	TranslationQueryHandlers,
} from "./translation";
import { UserCommandHandlers, UserQueryHandlers } from "./user";

export const CoreQueryHandlers = [
	...AbilityQueryHandlers,
	...ActionQueryHandlers,
	...AssetQueryHandlers,
	...CommunityQueryHandlers,
	...FolderQueryHandlers,
	...InquiryQueryHandlers,
	...PolicyQueryHandlers,
	...PolicyAssignmentQueryHandlers,
	...RoleQueryHandlers,
	...RoutineQueryHandlers,
	...ServiceDocumentQueryHandlers,
	...SpaceQueryHandlers,
	...SubjectQueryHandlers,
	...TaskQueryHandlers,
	...TemplateQueryHandlers,
	...TenantAccessRequestQueryHandlers,
	...TimelineQueryHandlers,
	...TranslationQueryHandlers,
	...UserQueryHandlers,
];

export const CoreCommandHandlers = [
	...AbilityCommandHandlers,
	...ActionCommandHandlers,
	...AssetCommandHandlers,
	...CommunityCommandHandlers,
	...FolderCommandHandlers,
	...InquiryCommandHandlers,
	...PolicyCommandHandlers,
	...PolicyAssignmentCommandHandlers,
	...RoleCommandHandlers,
	...RoutineCommandHandlers,
	...ServiceDocumentCommandHandlers,
	...SpaceCommandHandlers,
	...SubjectCommandHandlers,
	...TaskCommandHandlers,
	...TemplateCommandHandlers,
	...TenantAccessRequestCommandHandlers,
	...TimelineCommandHandlers,
	...TranslationCommandHandlers,
	...UserCommandHandlers,
];

export const CoreUseCaseProviders = [
	...CoreCommandHandlers,
	...CoreQueryHandlers,
];

export * from "./ability";
export * from "./action";
export * from "./asset";
export * from "./community";
export * from "./folder";
export * from "./inquiry";
export * from "./policy";
export * from "./policy-assignment";
export * from "./role";
export * from "./routine";
export * from "./service-document";
export * from "./space";
export * from "./subject";
export * from "./task";
export * from "./template";
export * from "./tenant-access-request";
export * from "./timeline";
export * from "./translation";
export * from "./user";
