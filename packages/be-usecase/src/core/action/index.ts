import { CreateActionUseCase } from "./create-action.usecase";
import { DeleteActionUseCase } from "./delete-action.usecase";
import { GetActionByIdUseCase } from "./get-action-by-id.usecase";
import { GetActionsUseCase } from "./get-actions.usecase";
import { UpdateActionUseCase } from "./update-action.usecase";

export const ActionQueryHandlers = [GetActionsUseCase, GetActionByIdUseCase];

export const ActionCommandHandlers = [
	CreateActionUseCase,
	UpdateActionUseCase,
	DeleteActionUseCase,
];

export * from "./create-action.usecase";
export * from "./delete-action.usecase";
export * from "./get-action-by-id.usecase";
export * from "./get-actions.usecase";
export * from "./update-action.usecase";
