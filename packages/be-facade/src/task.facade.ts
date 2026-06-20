import { TaskAggregate } from "@cocrepo/aggregate";
import type {
	CreateExerciseDto,
	SpaceScope,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { Exercise, Routine, Task } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/prisma";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TaskFacade {
	private readonly logger = new Logger(TaskFacade.name);

	constructor(private readonly taskService: TaskAggregate) {}

	findTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<OffsetPaginatedResponse<Task[]>> {
		return this.getTasks(params);
	}

	async getTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<OffsetPaginatedResponse<Task[]>> {
		this.logger.debug("Task 목록 조회");
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;

		const taskResult = await this.taskService.findTasks({
			...params,
			skip,
			take,
		});

		return buildOffsetPaginatedResponse(
			taskResult.tasks,
			taskResult.total,
			skip,
			take,
		);
	}

	getExerciseByTaskId(taskId: string, spaceId: string): Promise<Exercise> {
		return this.getTaskExercise(taskId, spaceId);
	}

	getTaskExercise(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.CURRENT,
	): Promise<Exercise> {
		return this.taskService.getExerciseByTaskId(taskId, spaceId, spaceScope);
	}

	findTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		return this.getTaskRoutines(taskId, spaceId);
	}

	getTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		return this.taskService.findTaskRoutines(taskId, spaceId);
	}

	createTaskWithExercise(
		dto: CreateExerciseDto,
		spaceId: string,
		creatorId: string,
	): Promise<Task> {
		return this.createTask(dto, spaceId, creatorId);
	}

	createTask(
		dto: CreateExerciseDto,
		spaceId: string,
		creatorId: string,
	): Promise<Task> {
		return this.taskService.createTaskWithExercise(dto, spaceId, creatorId);
	}

	updateTaskExercise(
		taskId: string,
		dto: UpdateExerciseDto,
		spaceId: string,
	): Promise<Task> {
		return this.taskService.updateTaskExercise(taskId, dto, spaceId);
	}

	async deleteTask(taskId: string, spaceId: string): Promise<void> {
		await this.taskService.deleteTask(taskId, spaceId);
	}
}
