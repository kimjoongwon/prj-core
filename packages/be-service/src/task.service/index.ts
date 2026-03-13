import { EXERCISE_ERRORS } from "@cocrepo/constant";
import type {
	CreateExerciseDto,
	SpaceScope,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { Exercise, Routine, Task } from "@cocrepo/entity";
import { TasksRepository } from "@cocrepo/repository";
import { Transactional } from "@nestjs-cls/transactional";
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { SpaceContext } from "@cocrepo/context";

@Injectable()
export class TaskService {
	private readonly logger = new Logger(TaskService.name);

	constructor(
		private readonly tasksRepository: TasksRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async findTasks(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ tasks: Task[]; total: number }> {
		const { spaceId, spaceScope, skip, take, search } = params;
		const spaceIds =
			spaceScope === SpaceScopeEnum.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds ?? [spaceId]
				: [spaceId];

		const [tasks, total] = await this.tasksRepository.findManyTasks({
			spaceIds,
			skip,
			take,
			search,
		});

		return { tasks, total };
	}

	async findTaskById(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Task> {
		const spaceIds =
			spaceScope === SpaceScopeEnum.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds ?? [spaceId]
				: [spaceId];

		const task = await this.tasksRepository.findTaskById(taskId, spaceIds);
		if (!task) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return task;
	}

	async getExerciseByTaskId(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScopeEnum.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		const task = await this.findTaskById(taskId, spaceId, spaceScope);
		if (!task.exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return task.exercise;
	}

	async findTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		await this.findTaskById(taskId, spaceId, SpaceScopeEnum.INCLUDE_ANCESTORS);
		return this.tasksRepository.findTaskRoutines(taskId);
	}

	@Transactional()
	async createTaskWithExercise(
		dto: CreateExerciseDto,
		spaceId: string,
		creatorId: string,
	): Promise<Task> {
		this.logger.debug(`Task 생성: exercise=${dto.name}`);

		const task = await this.tasksRepository.create({
			spaceId,
			creatorId,
		});

		return this.tasksRepository.createExerciseByTaskId(task.id, {
			name: dto.name,
			duration: dto.duration,
			count: dto.count,
			description: dto.description ?? null,
			imageFileId: dto.imageFileId ?? null,
			videoFileId: dto.videoFileId ?? null,
		});
	}

	async updateTaskExercise(
		taskId: string,
		dto: UpdateExerciseDto,
		spaceId: string,
	): Promise<Task> {
		const task = await this.findTaskById(
			taskId,
			spaceId,
			SpaceScopeEnum.INCLUDE_ANCESTORS,
		);

		if (task.spaceId !== spaceId) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		return this.tasksRepository.updateExerciseByTaskId(taskId, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.duration !== undefined && { duration: dto.duration }),
			...(dto.count !== undefined && { count: dto.count }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.imageFileId !== undefined && { imageFileId: dto.imageFileId }),
			...(dto.videoFileId !== undefined && { videoFileId: dto.videoFileId }),
		});
	}

	@Transactional()
	async deleteTask(taskId: string, spaceId: string): Promise<void> {
		const task = await this.findTaskById(
			taskId,
			spaceId,
			SpaceScopeEnum.INCLUDE_ANCESTORS,
		);

		if (task.spaceId !== spaceId) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		const activityCount =
			await this.tasksRepository.countActivitiesUsingTask(taskId);
		if (activityCount > 0) {
			throw new ConflictException(EXERCISE_ERRORS.EXERCISE_IN_USE);
		}

		await this.tasksRepository.softDeleteExerciseByTaskId(taskId);
		await this.tasksRepository.softDeleteTaskById(taskId);
	}
}
