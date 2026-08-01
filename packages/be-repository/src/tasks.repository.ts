import { Routine, Task } from "@cocrepo/entity";
import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { PublicIdCreateInput } from "./public-id-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class TasksRepository {
	private readonly logger = new Logger(TasksRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findManyTasks(params: {
		spaceIds?: string[];
		skip: number;
		take: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<[Task[], number]> {
		this.logger.debug(
			`Task 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}, search=${params.search ?? "없음"}`,
		);

		const where: Prisma.TaskWhereInput = {
			removedAt: null,
			...(params.spaceIds || params.contentLanguageCode
				? {
						space: {
							...(params.spaceIds ? { id: { in: params.spaceIds } } : {}),
							...(params.contentLanguageCode
								? { contentLanguageCode: params.contentLanguageCode }
								: {}),
						},
					}
				: {}),
			exercise: {
				is: {
					removedAt: null,
					...(params.search
						? { name: { contains: params.search, mode: "insensitive" } }
						: {}),
				},
			},
		};

		const [items, total] = await Promise.all([
			this.txHost.tx.task.findMany({
				where,
				include: {
					exercise: true,
					space: { select: { id: true } },
					createdBy: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.task.count({ where }),
		]);

		return [items.map((item) => toDomainEntity(Task, item)), total];
	}

	async findTaskById(
		taskId: string,
		spaceIds?: string[],
	): Promise<Task | null> {
		this.logger.debug(`Task 단건 조회: ${taskId.slice(-8)}`);

		const result = await this.txHost.tx.task.findFirst({
			where: {
				id: taskId,
				removedAt: null,
				...(spaceIds ? { space: { id: { in: spaceIds } } } : {}),
				exercise: {
					is: {
						removedAt: null,
					},
				},
			},
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		return result ? toDomainEntity(Task, result) : null;
	}

	async findTasksByIds(
		taskIds: string[],
		spaceIds?: string[],
	): Promise<Task[]> {
		if (taskIds.length === 0) {
			return [];
		}

		this.logger.debug(`Task 다건 조회: count=${taskIds.length}`);

		const results = await this.txHost.tx.task.findMany({
			where: {
				id: { in: taskIds },
				removedAt: null,
				...(spaceIds ? { space: { id: { in: spaceIds } } } : {}),
				exercise: {
					is: {
						removedAt: null,
					},
				},
			},
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		return results.map((result) => toDomainEntity(Task, result));
	}

	async findTaskRoutines(taskId: string): Promise<Routine[]> {
		this.logger.debug(`Task 연관 루틴 조회: ${taskId.slice(-8)}`);

		const results = await this.txHost.tx.routine.findMany({
			where: {
				removedAt: null,
				activities: {
					some: {
						removedAt: null,
						task: { id: taskId },
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => toDomainEntity(Routine, result));
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.TaskUncheckedCreateInput,
			"space",
			"createdBy"
		>,
	): Promise<Task> {
		this.logger.debug("Task 생성");

		const { spaceId, createdById, ...taskData } = data;
		const result = await this.txHost.tx.task.create({
			data: {
				...taskData,
				space: { connect: { id: spaceId } },
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		return toDomainEntity(Task, result);
	}

	async createExerciseByTaskId(
		taskId: string,
		data: Omit<Prisma.ExerciseUncheckedCreateInput, "seq" | "taskSeq">,
	): Promise<Task> {
		this.logger.debug(`Task에 Exercise 생성: ${taskId.slice(-8)}`);

		await this.txHost.tx.exercise.create({
			data: {
				...data,
				task: { connect: { id: taskId } },
			},
		});

		const task = await this.txHost.tx.task.findUnique({
			where: { id: taskId },
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		if (!task) {
			throw new Error("TASK_NOT_FOUND");
		}

		return toDomainEntity(Task, task);
	}

	async updateExerciseByTaskId(
		taskId: string,
		data: Prisma.ExerciseUncheckedUpdateInput,
	): Promise<Task> {
		this.logger.debug(`Task의 Exercise 수정: ${taskId.slice(-8)}`);

		const exercise = await this.txHost.tx.exercise.findFirst({
			where: { task: { id: taskId } },
			select: { id: true },
		});
		if (!exercise) {
			throw new Error("EXERCISE_NOT_FOUND");
		}

		await this.txHost.tx.exercise.update({
			where: { id: exercise.id },
			data,
		});

		const task = await this.txHost.tx.task.findUnique({
			where: { id: taskId },
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		if (!task) {
			throw new Error("TASK_NOT_FOUND");
		}

		return toDomainEntity(Task, task);
	}

	async softDeleteTaskById(taskId: string): Promise<void> {
		this.logger.debug(`Task 소프트 삭제: ${taskId.slice(-8)}`);

		await this.txHost.tx.task.update({
			where: { id: taskId },
			data: { removedAt: new Date() },
		});
	}

	async softDeleteExerciseByTaskId(taskId: string): Promise<void> {
		this.logger.debug(`Exercise 소프트 삭제: ${taskId.slice(-8)}`);

		const exercise = await this.txHost.tx.exercise.findFirst({
			where: { task: { id: taskId } },
			select: { id: true },
		});
		if (!exercise) {
			return;
		}

		await this.txHost.tx.exercise.update({
			where: { id: exercise.id },
			data: { removedAt: new Date() },
		});
	}

	async countActivitiesUsingTask(taskId: string): Promise<number> {
		this.logger.debug(`Task 사용 Activity 수 조회: ${taskId.slice(-8)}`);

		return this.txHost.tx.activity.count({
			where: {
				task: { id: taskId },
				removedAt: null,
				routine: {
					removedAt: null,
				},
			},
		});
	}
}
