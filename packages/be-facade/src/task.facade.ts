import type {
	CreateExerciseDto,
	SpaceScope,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { Exercise, Routine, Task } from "@cocrepo/entity";
import { TaskService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TaskFacade {
	private readonly logger = new Logger(TaskFacade.name);

	constructor(private readonly taskService: TaskService) {}

	findTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{
		data: Task[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		return this.getTasks(params);
	}

	async getTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{
		data: Task[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		this.logger.debug("Task 목록 조회");
		const skip = params.skip ?? 0;
		const take = params.take ?? 10;

		const { tasks, total } = await this.taskService.findTasks({
			...params,
			skip,
			take,
		});

		return {
			data: tasks,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		};
	}

	getExerciseByTaskId(taskId: string, spaceId: string): Promise<Exercise> {
		return this.getTaskExercise(taskId, spaceId);
	}

	getTaskExercise(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
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
