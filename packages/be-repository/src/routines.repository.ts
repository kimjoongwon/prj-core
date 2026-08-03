import { Routine } from "@cocrepo/entity";
import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class RoutinesRepository {
	private readonly logger = new Logger(RoutinesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * Space 계층 공유를 지원하는 루틴 목록을 조회합니다.
	 */
	async findManyRoutines(params: {
		spaceIds?: bigint[];
		skip: number;
		take: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<[Routine[], number]> {
		this.logger.debug(
			`루틴 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개, search=${params.search ?? "없음"}`,
		);

		const where: Prisma.RoutineWhereInput = {
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
			...(params.search
				? { name: { contains: params.search, mode: "insensitive" } }
				: {}),
		};

		const [items, total] = await Promise.all([
			this.txHost.tx.routine.findMany({
				where,
				include: this.includeRoutineDetails(),
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.routine.count({ where }),
		]);

		return [items.map((item) => toDomainEntity(Routine, item)), total];
	}

	/**
	 * 내부 숫자 ID로 루틴 하나를 조회합니다.
	 */
	async findRoutineById(
		routineId: bigint,
		spaceIds?: bigint[],
	): Promise<Routine | null> {
		this.logger.debug(`루틴 단건 조회: ${routineId}`);

		const result = await this.txHost.tx.routine.findFirst({
			where: {
				id: routineId,
				removedAt: null,
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			},
			include: this.includeRoutineDetails(),
		});

		return result ? toDomainEntity(Routine, result) : null;
	}

	/**
	 * 공개 관계 ID를 사용해 루틴과 활동을 생성합니다.
	 */
	async createRoutine(data: {
		name: string;
		label: string;
		spaceId: bigint;
		createdById?: bigint;
		activities?: {
			taskId: bigint;
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
				...(data.createdById ? { createdById: data.createdById } : {}),
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
			include: this.includeRoutineDetails(),
		});

		return toDomainEntity(Routine, result);
	}

	/**
	 * 루틴 기본 정보와 활동 목록을 갱신합니다.
	 */
	async updateRoutine(
		routineId: bigint,
		data: {
			name?: string;
			label?: string;
			activities?: {
				taskId: bigint;
				order: number;
				repetitions: number;
				restTime: number;
				notes?: string;
			}[];
		},
	): Promise<Routine> {
		this.logger.debug(`루틴 수정: ${routineId}`);

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
			include: this.includeRoutineDetails(),
		});

		return toDomainEntity(Routine, result);
	}

	/**
	 * 루틴과 종속 활동을 소프트 삭제합니다.
	 */
	async softDeleteRoutine(routineId: bigint): Promise<void> {
		this.logger.debug(`루틴 소프트 삭제: ${routineId}`);

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
	 * 특정 루틴을 사용하는 Program 수를 반환합니다.
	 */
	async countProgramsUsingRoutine(routineId: bigint): Promise<number> {
		this.logger.debug(`루틴 사용 Program 수 조회: ${routineId}`);

		return this.txHost.tx.program.count({
			where: {
				routineId,
				removedAt: null,
			},
		});
	}

	private includeRoutineDetails() {
		return {
			space: { select: { id: true } },
			createdBy: { select: { id: true } },
			_count: {
				select: {
					activities: { where: { removedAt: null } },
					programs: { where: { removedAt: null } },
				},
			},
			activities: {
				where: { removedAt: null },
				include: {
					routine: { select: { id: true } },
					task: {
						include: {
							exercise: true,
							space: { select: { id: true } },
							createdBy: { select: { id: true } },
						},
					},
				},
			},
			programs: {
				where: { removedAt: null },
				include: {
					routine: { select: { id: true } },
					session: { select: { id: true } },
				},
			},
		} satisfies Prisma.RoutineInclude;
	}
}
