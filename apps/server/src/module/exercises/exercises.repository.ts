import { Exercise, Routine } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ExercisesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("ExercisesRepository");
	}

	// ============================================================================
	// Exercise 조회
	// ============================================================================

	/**
	 * 운동 목록 조회 (Space 계층 공유 지원)
	 */
	async findManyExercises(params: {
		spaceIds: string[];
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ items: Exercise[]; count: number }> {
		const { spaceIds, skip, take, search } = params;
		this.logger.debug(`운동 목록 조회: spaceIds=${spaceIds.length}개`);

		const where: Prisma.ExerciseWhereInput = {
			removedAt: null,
			task: {
				spaceId: { in: spaceIds },
				removedAt: null,
			},
			name: search ? { contains: search, mode: "insensitive" } : undefined,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.exercise.findMany({
				where,
				include: {
					task: {
						include: {
							space: {
								select: {
									id: true,
									ground: { select: { name: true } },
								},
							},
							creator: { select: { id: true, name: true } },
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.exercise.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Exercise, item)),
			count,
		};
	}

	/**
	 * ID로 운동 조회
	 */
	async findExerciseById(
		exerciseId: string,
		spaceIds: string[],
	): Promise<Exercise | null> {
		this.logger.debug(`ID로 운동 조회: exerciseId=${exerciseId.slice(-8)}`);

		const result = await this.txHost.tx.exercise.findFirst({
			where: {
				id: exerciseId,
				removedAt: null,
				task: { spaceId: { in: spaceIds }, removedAt: null },
			},
			include: {
				task: {
					include: {
						space: {
							select: {
								id: true,
								ground: { select: { name: true } },
							},
						},
						creator: { select: { id: true, name: true } },
					},
				},
			},
		});

		return result ? plainToInstance(Exercise, result) : null;
	}

	/**
	 * 운동을 사용하는 루틴 목록 조회
	 */
	async findRoutinesByExerciseId(exerciseId: string): Promise<Routine[]> {
		this.logger.debug(
			`운동을 사용하는 루틴 조회: exerciseId=${exerciseId.slice(-8)}`,
		);

		const results = await this.txHost.tx.routine.findMany({
			where: {
				removedAt: null,
				activities: {
					some: {
						removedAt: null,
						task: { exercise: { id: exerciseId } },
					},
				},
			},
			include: {
				space: {
					select: {
						id: true,
						ground: { select: { name: true } },
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Routine, result));
	}

	/**
	 * 운동 사용 Activity 수 조회
	 */
	async countActivitiesByExerciseId(exerciseId: string): Promise<number> {
		this.logger.debug(
			`운동 사용 Activity 수 조회: exerciseId=${exerciseId.slice(-8)}`,
		);

		return this.txHost.tx.activity.count({
			where: {
				removedAt: null,
				task: { exercise: { id: exerciseId } },
			},
		});
	}

	// ============================================================================
	// Exercise 생성/수정/삭제
	// ============================================================================

	/**
	 * Task + Exercise 동시 생성
	 */
	async createExerciseWithTask(params: {
		name: string;
		duration: number;
		count: number;
		description?: string;
		imageFileId?: string;
		videoFileId?: string;
		spaceId: string;
		creatorId?: string;
	}): Promise<Exercise> {
		const {
			name,
			duration,
			count,
			description,
			imageFileId,
			videoFileId,
			spaceId,
			creatorId,
		} = params;
		this.logger.debug("Task + Exercise 동시 생성 중...");

		// Task 먼저 생성
		const task = await this.txHost.tx.task.create({
			data: {
				spaceId,
				creatorId,
			},
		});

		// Exercise 생성
		const result = await this.txHost.tx.exercise.create({
			data: {
				name,
				duration,
				count,
				description,
				imageFileId,
				videoFileId,
				taskId: task.id,
			},
			include: {
				task: {
					include: {
						space: true,
					},
				},
			},
		});

		return plainToInstance(Exercise, result);
	}

	/**
	 * 운동 수정
	 */
	async updateExercise(
		exerciseId: string,
		data: Prisma.ExerciseUncheckedUpdateInput,
	): Promise<Exercise> {
		this.logger.debug(`운동 수정 중: ${exerciseId.slice(-8)}`);

		const result = await this.txHost.tx.exercise.update({
			where: { id: exerciseId },
			data,
			include: {
				task: true,
			},
		});

		return plainToInstance(Exercise, result);
	}

	/**
	 * 운동 + Task 동시 소프트 삭제
	 */
	async removeExerciseWithTaskById(exerciseId: string): Promise<Exercise> {
		this.logger.debug(
			`운동 + Task 동시 소프트 삭제 중: ${exerciseId.slice(-8)}`,
		);

		// Exercise 조회하여 taskId 획득
		const exercise = await this.txHost.tx.exercise.findUnique({
			where: { id: exerciseId },
			select: { taskId: true },
		});

		if (!exercise) {
			throw new Error(`Exercise not found: ${exerciseId}`);
		}

		// Exercise 소프트 삭제
		const result = await this.txHost.tx.exercise.update({
			where: { id: exerciseId },
			data: { removedAt: new Date() },
		});

		// Task 소프트 삭제
		await this.txHost.tx.task.update({
			where: { id: exercise.taskId },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Exercise, result);
	}
}
