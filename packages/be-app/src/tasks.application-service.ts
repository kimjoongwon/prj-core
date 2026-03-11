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

	async getTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ tasks: Task[]; total: number }> {
		this.logger.debug("Task 목록 조회");
		return this.tasksService.findTasks(params);
	}

	async getTaskById(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Task> {
		return this.tasksService.findTaskById(taskId, spaceId, spaceScope);
	}

	async getTaskExercise(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		return this.tasksService.getExerciseByTaskId(taskId, spaceId, spaceScope);
	}

	async getTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		return this.tasksService.findTaskRoutines(taskId, spaceId);
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
