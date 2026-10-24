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
		spaceSeq: bigint;
		spaceScope: SpaceScope;
		skip: number;
		take: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<{ tasks: Task[]; total: number }> {
		const spaceIds = this.resolveReadableSpaceIds(
			params.spaceScope,
			params.spaceSeq,
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
		taskSeq: bigint,
		spaceSeq: bigint,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Task> {
		const spaceIds = this.resolveReadableSpaceIds(spaceScope, spaceSeq);

		const task = await this.tasksRepository.findTaskById(taskSeq, spaceIds);
		if (!task) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return task;
	}

	async getExerciseByTaskId(
		taskSeq: bigint,
		spaceSeq: bigint,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		const task = await this.findTaskById(taskSeq, spaceSeq, spaceScope);
		if (!task.exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		task.exercise.task = task;
		return task.exercise;
	}

	async findTaskRoutines(taskSeq: bigint, spaceSeq: bigint): Promise<Routine[]> {
		await this.findTaskById(taskSeq, spaceSeq, SpaceScope.INCLUDE_ANCESTORS);
		return this.tasksRepository.findTaskRoutines(taskSeq);
	}

	@Transactional()
	async createTaskWithExercise(
		dto: CreateTaskCommandInput,
		spaceSeq: bigint,
		createdBySeq: bigint,
	): Promise<Task> {
		this.logger.debug(`Task 생성: exercise=${dto.name}`);
		const task = await this.tasksRepository.create({
			spaceSeq,
			createdBySeq,
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
		taskSeq: bigint,
		dto: UpdateTaskExerciseCommandInput,
		spaceSeq: bigint,
	): Promise<Task> {
		const task = await this.findTaskById(
			taskSeq,
			spaceSeq,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		if (task.spaceSeq !== spaceSeq) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		return this.tasksRepository.updateExerciseByTaskId(taskSeq, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.duration !== undefined && { duration: dto.duration }),
			...(dto.count !== undefined && { count: dto.count }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.imageFileId !== undefined && { imageFileId: dto.imageFileId }),
			...(dto.videoFileId !== undefined && { videoFileId: dto.videoFileId }),
		});
	}

	@Transactional()
	async deleteTask(taskSeq: bigint, spaceSeq: bigint): Promise<void> {
		const task = await this.findTaskById(
			taskSeq,
			spaceSeq,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		if (task.spaceSeq !== spaceSeq) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		const activityCount =
			await this.tasksRepository.countActivitiesUsingTask(taskSeq);
		if (activityCount > 0) {
			throw new ConflictException(EXERCISE_ERRORS.EXERCISE_IN_USE);
		}

		await this.tasksRepository.softDeleteExerciseByTaskId(taskSeq);
		await this.tasksRepository.softDeleteTaskById(taskSeq);
	}

	private resolveReadableSpaceIds(
		spaceScope: SpaceScope,
		spaceSeq: bigint,
	): bigint[] | undefined {
		if (this.spaceContext.spaceIds === undefined) {
			return undefined;
		}

		return spaceScope === SpaceScope.INCLUDE_ANCESTORS
			? this.spaceContext.spaceIds
			: [spaceSeq];
	}
}
