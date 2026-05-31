import { CreateRoleUseCase } from "./create-role.usecase";
import { DeleteRoleUseCase } from "./delete-role.usecase";
import { GetRoleByIdUseCase } from "./get-role-by-id.usecase";
import { GetRolesUseCase } from "./get-roles.usecase";
import { UpdateRoleUseCase } from "./update-role.usecase";

export const RoleQueryHandlers = [GetRolesUseCase, GetRoleByIdUseCase];

export const RoleCommandHandlers = [
	CreateRoleUseCase,
	UpdateRoleUseCase,
	DeleteRoleUseCase,
];

export * from "./create-role.usecase";
export * from "./delete-role.usecase";
export * from "./get-role-by-id.usecase";
export * from "./get-roles.usecase";
export * from "./update-role.usecase";
