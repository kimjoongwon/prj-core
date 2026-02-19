import { Exercise, Routine } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ExercisesRepository {
	private readonly logger = new Logger(ExercisesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * Space 계층 공유를 지원하는 운동 종목 목록 조회
	 * spaceIds 배열로 여러 Space의 Exercise를 한 번에 조회합니다.
	 */
	async findManyExercises(params: {
		spaceIds: string[];
		skip: number;
		take: number;
		search?: string;
	}): Promise<[Exercise[], number]> {
		const { spaceIds, skip, take, search } = params;
		this.logger.debug(
			`운동 종목 목록 조회: spaceIds=${spaceIds.length}개, search=${search ?? "없음"}`,
		);

		const whereCondition = {
			removedAt: null,
			task: {
				spaceId: { in: spaceIds },
				removedAt: null,
			},
			...(search
				? { name: { contains: search, mode: "insensitive" as const } }
				: {}),
		};

		const [items, total] = await Promise.all([
			this.txHost.tx.exercise.findMany({
				where: whereCondition,
				include: {
					task: {
						include: {
							space: { select: { id: true } },
							creator: { select: { id: true, name: true } },
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take,
			}),
			this.txHost.tx.exercise.count({
				where: whereCondition,
			}),
		]);

		return [items.map((item) => plainToInstance(Exercise, item)), total];
	}

	/**
	 * 단일 운동 종목 조회 (Space 계층 필터 적용)
	 */
	async findExerciseById(
		exerciseId: string,
		spaceIds: string[],
	): Promise<Exercise | null> {
		this.logger.debug(`운동 종목 단건 조회: ${exerciseId.slice(-8)}`);

		const result = await this.txHost.tx.exercise.findFirst({
			where: {
				id: exerciseId,
				removedAt: null,
				task: { spaceId: { in: spaceIds }, removedAt: null },
			},
			include: {
				task: {
					include: {
						space: { select: { id: true } },
						creator: { select: { id: true, name: true } },
					},
				},
			},
		});

		return result ? plainToInstance(Exercise, result) : null;
	}

	/**
	 * 특정 운동 종목을 Activity로 포함하는 루틴 목록 조회
	 */
	async findExerciseRoutines(exerciseId: string): Promise<Routine[]> {
		this.logger.debug(`운동 종목 관련 루틴 조회: ${exerciseId.slice(-8)}`);

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
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Routine, result));
	}

	/**
	 * Task 생성 (createExerciseWithTask의 내부 단계)
	 */
	async createTask(data: {
		spaceId: string;
		creatorId: string;
	}) {
		this.logger.debug("Task 생성");
		return this.txHost.tx.task.create({ data });
	}

	/**
	 * Exercise 생성 (createExerciseWithTask의 내부 단계)
	 */
	async createExercise(data: {
		name: string;
		duration: number;
		count: number;
		description?: string | null;
		imageFileId?: string | null;
		videoFileId?: string | null;
		taskId: string;
	}): Promise<Exercise> {
		this.logger.debug(`운동 종목 생성: name=${data.name}`);

		const result = await this.txHost.tx.exercise.create({
			data: {
				name: data.name,
				duration: data.duration,
				count: data.count,
				description: data.description ?? null,
				imageFileId: data.imageFileId ?? null,
				videoFileId: data.videoFileId ?? null,
				taskId: data.taskId,
			},
			include: {
				task: {
					include: { space: { select: { id: true } } },
				},
			},
		});

		return plainToInstance(Exercise, result);
	}

	/**
	 * 운동 종목 정보 수정
	 */
	async updateExercise(
		exerciseId: string,
		data: {
			name?: string;
			duration?: number;
			count?: number;
			description?: string | null;
			imageFileId?: string | null;
			videoFileId?: string | null;
		},
	): Promise<Exercise> {
		this.logger.debug(`운동 종목 수정: ${exerciseId.slice(-8)}`);

		const result = await this.txHost.tx.exercise.update({
			where: { id: exerciseId },
			data,
			include: { task: true },
		});

		return plainToInstance(Exercise, result);
	}

	/**
	 * Exercise 소프트 삭제
	 */
	async softDeleteExerciseById(exerciseId: string) {
		this.logger.debug(`Exercise 소프트 삭제: ${exerciseId.slice(-8)}`);

		return this.txHost.tx.exercise.update({
			where: { id: exerciseId },
			data: { removedAt: new Date() },
		});
	}

	/**
	 * Task 소프트 삭제
	 */
	async softDeleteTaskById(taskId: string): Promise<void> {
		this.logger.debug(`Task 소프트 삭제: ${taskId.slice(-8)}`);

		await this.txHost.tx.task.update({
			where: { id: taskId },
			data: { removedAt: new Date() },
		});
	}

	/**
	 * 특정 운동 종목을 사용하는 Activity 수 카운트
	 * 삭제 가능 여부 확인에 사용됩니다.
	 */
	async countActivitiesUsingExercise(exerciseId: string): Promise<number> {
		this.logger.debug(
			`운동 종목 사용 Activity 수 조회: ${exerciseId.slice(-8)}`,
		);

		return this.txHost.tx.activity.count({
			where: {
				removedAt: null,
				task: { exercise: { id: exerciseId } },
			},
		});
	}
}
