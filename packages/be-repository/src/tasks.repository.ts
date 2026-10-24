import { Routine, Task } from "@cocrepo/entity";
import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type { AutoIdentityCreateInput } from "./auto-identity-input.type";
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
		spaceIds?: bigint[];
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
							...(params.spaceIds ? { seq: { in: params.spaceIds } } : {}),
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
		taskSeq: bigint,
		spaceIds?: bigint[],
	): Promise<Task | null> {
		this.logger.debug(`Task 단건 조회: ${taskSeq}`);

		const result = await this.txHost.tx.task.findFirst({
			where: {
				seq: taskSeq,
				removedAt: null,
				...(spaceIds ? { spaceSeq: { in: spaceIds } } : {}),
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
		taskIds: bigint[],
		spaceIds?: bigint[],
	): Promise<Task[]> {
		if (taskIds.length === 0) {
			return [];
		}

		this.logger.debug(`Task 다건 조회: count=${taskIds.length}`);

		const results = await this.txHost.tx.task.findMany({
			where: {
				seq: { in: taskIds },
				removedAt: null,
				...(spaceIds ? { spaceSeq: { in: spaceIds } } : {}),
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

	async findTaskRoutines(taskSeq: bigint): Promise<Routine[]> {
		this.logger.debug(`Task 연관 루틴 조회: ${taskSeq}`);

		const results = await this.txHost.tx.routine.findMany({
			where: {
				removedAt: null,
				activities: {
					some: {
						removedAt: null,
						taskSeq,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => toDomainEntity(Routine, result));
	}

	async create(
		data: AutoIdentityCreateInput<Prisma.TaskUncheckedCreateInput, "id">,
	): Promise<Task> {
		this.logger.debug("Task 생성");
		const result = await this.txHost.tx.task.create({
			data,
			include: {
				exercise: true,
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		return toDomainEntity(Task, result);
	}

	async createExerciseByTaskId(
		taskSeq: bigint,
		data: Omit<
			AutoIdentityCreateInput<
				Prisma.ExerciseUncheckedCreateInput,
				"id"
			>,
			"taskSeq"
		>,
	): Promise<Task> {
		this.logger.debug(`Task에 Exercise 생성: ${taskSeq.toString()}`);

		await this.txHost.tx.exercise.create({
			data: {
				...data,
				taskSeq,
			},
		});

		const task = await this.txHost.tx.task.findUnique({
			where: { seq: taskSeq },
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
		taskSeq: bigint,
		data: Prisma.ExerciseUncheckedUpdateInput,
	): Promise<Task> {
		this.logger.debug(`Task의 Exercise 수정: ${taskSeq}`);

		const exercise = await this.txHost.tx.exercise.findFirst({
			where: { taskSeq },
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
			where: { seq: taskSeq },
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

	async softDeleteTaskById(taskSeq: bigint): Promise<void> {
		this.logger.debug(`Task 소프트 삭제: ${taskSeq}`);

		await this.txHost.tx.task.update({
			where: { seq: taskSeq },
			data: { removedAt: new Date() },
		});
	}

	async softDeleteExerciseByTaskId(taskSeq: bigint): Promise<void> {
		this.logger.debug(`Exercise 소프트 삭제: ${taskSeq}`);

		const exercise = await this.txHost.tx.exercise.findFirst({
			where: { taskSeq },
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

	async countActivitiesUsingTask(taskSeq: bigint): Promise<number> {
		this.logger.debug(`Task 사용 Activity 수 조회: ${taskSeq}`);

		return this.txHost.tx.activity.count({
			where: {
				taskSeq,
				removedAt: null,
				routine: {
					removedAt: null,
				},
			},
		});
	}
}
