import { CreateRoutineUseCase } from "./create-routine.usecase";
import { DeleteRoutineUseCase } from "./delete-routine.usecase";
import { GetRoutineByIdUseCase } from "./get-routine-by-id.usecase";
import { GetRoutinesUseCase } from "./get-routines.usecase";
import { UpdateRoutineUseCase } from "./update-routine.usecase";

export const RoutineQueryHandlers = [GetRoutinesUseCase, GetRoutineByIdUseCase];

export const RoutineCommandHandlers = [
	CreateRoutineUseCase,
	UpdateRoutineUseCase,
	DeleteRoutineUseCase,
];

export * from "./create-routine.usecase";
export * from "./delete-routine.usecase";
export * from "./get-routine-by-id.usecase";
export * from "./get-routines.usecase";
export * from "./update-routine.usecase";
