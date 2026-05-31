import { GetRolePoliciesUseCase } from "./get-role-policies.usecase";
import { GetUserPoliciesUseCase } from "./get-user-policies.usecase";
import { SyncRolePoliciesUseCase } from "./sync-role-policies.usecase";
import { SyncUserPoliciesUseCase } from "./sync-user-policies.usecase";

export const PolicyAssignmentQueryHandlers = [
	GetRolePoliciesUseCase,
	GetUserPoliciesUseCase,
];

export const PolicyAssignmentCommandHandlers = [
	SyncRolePoliciesUseCase,
	SyncUserPoliciesUseCase,
];

export * from "./get-role-policies.usecase";
export * from "./get-user-policies.usecase";
export * from "./sync-role-policies.usecase";
export * from "./sync-user-policies.usecase";
