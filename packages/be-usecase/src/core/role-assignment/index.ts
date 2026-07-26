import { GetRoleAssignmentsUseCase } from "./get-role-assignments.usecase";
import { SyncRoleAssignmentsUseCase } from "./sync-role-assignments.usecase";

export const RoleAssignmentQueryHandlers = [GetRoleAssignmentsUseCase];

export const RoleAssignmentCommandHandlers = [SyncRoleAssignmentsUseCase];

export * from "./get-role-assignments.usecase";
export * from "./sync-role-assignments.usecase";
