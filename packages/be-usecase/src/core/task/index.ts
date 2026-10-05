import { CreateTaskUseCase } from "./create-task.usecase";
import { DeleteTaskUseCase } from "./delete-task.usecase";
import { FindTasksUseCase } from "./find-tasks.usecase";
import { GetTaskExerciseUseCase } from "./get-task-exercise.usecase";
import { GetTaskRoutinesUseCase } from "./get-task-routines.usecase";
import { UpdateTaskExerciseUseCase } from "./update-task-exercise.usecase";

export const TaskQueryHandlers = [
	FindTasksUseCase,
	GetTaskExerciseUseCase,
	GetTaskRoutinesUseCase,
];

export const TaskCommandHandlers = [
	CreateTaskUseCase,
	UpdateTaskExerciseUseCase,
	DeleteTaskUseCase,
];

export * from "./create-task.usecase";
export * from "./delete-task.usecase";
export * from "./find-tasks.usecase";
export * from "./get-task-exercise.usecase";
export * from "./get-task-routines.usecase";
export * from "./update-task-exercise.usecase";
