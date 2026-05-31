import { Routine } from "@cocrepo/entity";
import { LanguageCode, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class RoutinesRepository {
	private readonly logger = new Logger(RoutinesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * Space 계층 공유를 지원하는 루틴 목록 조회
	 * spaceIds 배열로 여러 Space의 Routine을 한 번에 조회합니다.
	 */
	async findManyRoutines(params: {
		spaceIds?: string[];
		skip: number;
		take: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<[Routine[], number]> {
		this.logger.debug(
			`루틴 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개, search=${params.search ?? "없음"}`,
		);

		const whereCondition = {
			removedAt: null,
			...(params.spaceIds ? { spaceId: { in: params.spaceIds } } : {}),
			...(params.contentLanguageCode
				? { space: { contentLanguageCode: params.contentLanguageCode } }
				: {}),
			...(params.search
				? { name: { contains: params.search, mode: "insensitive" as const } }
				: {}),
		};

		const [items, total] = await Promise.all([
			this.txHost.tx.routine.findMany({
				where: whereCondition,
				include: {
					_count: {
						select: {
							activities: { where: { removedAt: null } },
							programs: { where: { removedAt: null } },
						},
					},
					activities: {
						where: { removedAt: null },
						include: {
							task: {
								include: {
									exercise: true,
								},
							},
						},
					},
					programs: {
						where: { removedAt: null },
					},
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.routine.count({
				where: whereCondition,
			}),
		]);

		return [items.map((item) => plainToInstance(Routine, item)), total];
	}

	/**
	 * 단일 루틴 조회 (Space 계층 필터 적용)
	 */
	async findRoutineById(
		routineId: string,
		spaceIds?: string[],
	): Promise<Routine | null> {
		this.logger.debug(`루틴 단건 조회: ${routineId.slice(-8)}`);

		const result = await this.txHost.tx.routine.findFirst({
			where: {
				id: routineId,
				removedAt: null,
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			},
			include: {
				_count: {
					select: {
						activities: { where: { removedAt: null } },
						programs: { where: { removedAt: null } },
					},
				},
				activities: {
					where: { removedAt: null },
					include: {
						task: {
							include: {
								exercise: true,
							},
						},
					},
				},
				programs: {
					where: { removedAt: null },
				},
			},
		});

		return result ? plainToInstance(Routine, result) : null;
	}

	/**
	 * 루틴 생성
	 */
	async createRoutine(data: {
		name: string;
		label: string;
		spaceId: string;
		creatorId?: string;
		activities?: {
			taskId: string;
			order: number;
			repetitions: number;
			restTime: number;
			notes?: string;
		}[];
	}): Promise<Routine> {
		this.logger.debug(`루틴 생성: name=${data.name}`);

		const result = await this.txHost.tx.routine.create({
			data: {
				name: data.name,
				label: data.label,
				spaceId: data.spaceId,
				creatorId: data.creatorId ?? null,
				activities: data.activities
					? {
							create: data.activities.map((activity) => ({
								taskId: activity.taskId,
								order: activity.order,
								repetitions: activity.repetitions,
								restTime: activity.restTime,
								notes: activity.notes ?? null,
							})),
						}
					: undefined,
			},
		});

		return plainToInstance(Routine, result);
	}

	/**
	 * 루틴 수정
	 */
	async updateRoutine(
		routineId: string,
		data: {
			name?: string;
			label?: string;
			activities?: {
				taskId: string;
				order: number;
				repetitions: number;
				restTime: number;
				notes?: string;
			}[];
		},
	): Promise<Routine> {
		this.logger.debug(`루틴 수정: ${routineId.slice(-8)}`);

		const result = await this.txHost.tx.routine.update({
			where: { id: routineId },
			data: {
				name: data.name,
				label: data.label,
				activities:
					data.activities === undefined
						? undefined
						: {
								deleteMany: {},
								create: data.activities.map((activity) => ({
									taskId: activity.taskId,
									order: activity.order,
									repetitions: activity.repetitions,
									restTime: activity.restTime,
									notes: activity.notes ?? null,
								})),
							},
			},
		});

		return plainToInstance(Routine, result);
	}

	/**
	 * 루틴 소프트 삭제
	 */
	async softDeleteRoutine(routineId: string): Promise<void> {
		this.logger.debug(`루틴 소프트 삭제: ${routineId.slice(-8)}`);

		const removedAt = new Date();

		await this.txHost.tx.routine.update({
			where: { id: routineId },
			data: { removedAt },
		});

		await this.txHost.tx.activity.updateMany({
			where: {
				routineId,
				removedAt: null,
			},
			data: { removedAt },
		});
	}

	/**
	 * 특정 루틴을 사용하는 Program 수 카운트
	 * 삭제 가능 여부 확인에 사용됩니다.
	 */
	async countProgramsUsingRoutine(routineId: string): Promise<number> {
		this.logger.debug(`루틴 사용 Program 수 조회: ${routineId.slice(-8)}`);

		return this.txHost.tx.program.count({
			where: {
				routineId,
				removedAt: null,
			},
		});
	}
}
