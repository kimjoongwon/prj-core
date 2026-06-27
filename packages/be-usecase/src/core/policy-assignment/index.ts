import { GetRolePoliciesUseCase } from "./get-role-policies.usecase";
import { SyncRolePoliciesUseCase } from "./sync-role-policies.usecase";

export const PolicyAssignmentQueryHandlers = [GetRolePoliciesUseCase];

export const PolicyAssignmentCommandHandlers = [SyncRolePoliciesUseCase];

export * from "./get-role-policies.usecase";
export * from "./sync-role-policies.usecase";
