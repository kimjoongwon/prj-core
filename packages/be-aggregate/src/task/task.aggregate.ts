import { EXERCISE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { Exercise, Routine, Task } from "@cocrepo/entity";
import type {
	CreateTaskCommandInput,
	UpdateTaskExerciseCommandInput,
} from "@cocrepo/input";
import type { LanguageCode } from "@cocrepo/prisma";
import { TasksRepository } from "@cocrepo/repository";
import { SpaceScope } from "@cocrepo/type";
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class TaskAggregate {
	private readonly logger = new Logger(TaskAggregate.name);

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
		contentLanguageCode?: LanguageCode;
	}): Promise<{ tasks: Task[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds(
			params.spaceScope,
			params.spaceId,
		);

		const [tasks, total] = await this.tasksRepository.findManyTasks({
			spaceIds,
			skip: params.skip,
			take: params.take,
			search: params.search,
			contentLanguageCode: params.contentLanguageCode,
		});

		return { tasks, total };
	}

	async findTaskById(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Task> {
		const spaceIds = this.resolveReadableSpaceIds(spaceScope, spaceId);

		const task = await this.tasksRepository.findTaskById(taskId, spaceIds);
		if (!task) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return task;
	}

	async getExerciseByTaskId(
		taskId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		const task = await this.findTaskById(taskId, spaceId, spaceScope);
		if (!task.exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return task.exercise;
	}

	async findTaskRoutines(taskId: string, spaceId: string): Promise<Routine[]> {
		await this.findTaskById(taskId, spaceId, SpaceScope.INCLUDE_ANCESTORS);
		return this.tasksRepository.findTaskRoutines(taskId);
	}

	@Transactional()
	async createTaskWithExercise(
		dto: CreateTaskCommandInput,
		spaceId: string,
		createdById: string,
	): Promise<Task> {
		this.logger.debug(`Task 생성: exercise=${dto.name}`);
		const task = await this.tasksRepository.create({
			spaceId,
			createdById,
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
		dto: UpdateTaskExerciseCommandInput,
		spaceId: string,
	): Promise<Task> {
		const task = await this.findTaskById(
			taskId,
			spaceId,
			SpaceScope.INCLUDE_ANCESTORS,
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
			SpaceScope.INCLUDE_ANCESTORS,
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

	private resolveReadableSpaceIds(
		spaceScope: SpaceScope,
		spaceId: string,
	): string[] | undefined {
		if (this.spaceContext.spaceIds === undefined) {
			return undefined;
		}

		return spaceScope === SpaceScope.INCLUDE_ANCESTORS
			? this.spaceContext.spaceIds
			: [spaceId];
	}
}
