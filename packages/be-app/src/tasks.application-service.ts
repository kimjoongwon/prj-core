import type {
	CreateExerciseDto,
	SpaceScope,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { Exercise, Routine, Task } from "@cocrepo/entity";
import { TasksService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TasksApplicationService {
	private readonly logger = new Logger(TasksApplicationService.name);

	constructor(private readonly tasksService: TasksService) {}

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

		const { tasks, total } = await this.tasksService.findTasks({
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

	findTaskById(taskId: string, spaceId: string): Promise<Task> {
		return this.getTaskById(taskId, spaceId);
	}

	async getTaskById(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Task> {
		return this.tasksService.findTaskById(taskId, spaceId, spaceScope);
	}

	getExerciseByTaskId(taskId: string, spaceId: string): Promise<Exercise> {
		return this.getTaskExercise(taskId, spaceId);
	}

	async getTaskExercise(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		return this.tasksService.getExerciseByTaskId(taskId, spaceId, spaceScope);
	}

	findTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		return this.getTaskRoutines(taskId, spaceId);
	}

	async getTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		return this.tasksService.findTaskRoutines(taskId, spaceId);
	}

	createTaskWithExercise(
		dto: CreateExerciseDto,
		spaceId: string,
		creatorId: string,
	): Promise<Task> {
		return this.createTask(dto, spaceId, creatorId);
	}

	async createTask(
		dto: CreateExerciseDto,
		spaceId: string,
		creatorId: string,
	): Promise<Task> {
		return this.tasksService.createTaskWithExercise(dto, spaceId, creatorId);
	}

	async updateTaskExercise(
		taskId: string,
		dto: UpdateExerciseDto,
		spaceId: string,
	): Promise<Task> {
		return this.tasksService.updateTaskExercise(taskId, dto, spaceId);
	}

	async deleteTask(taskId: string, spaceId: string): Promise<void> {
		await this.tasksService.deleteTask(taskId, spaceId);
	}
}
