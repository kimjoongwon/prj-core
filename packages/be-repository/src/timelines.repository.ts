import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainData } from "./to-domain-entity";

function omitProgramActivities<T extends { programActivities: unknown }>(
	program: T,
): Omit<T, "programActivities"> {
	const programRecord = { ...program } as Omit<T, "programActivities"> & {
		programActivities?: unknown;
	};
	delete programRecord.programActivities;
	return programRecord;
}

@Injectable()
export class TimelinesRepository {
	private readonly logger = new Logger(TimelinesRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	// ============================================================================
	// Timeline 쿼리
	// ============================================================================

	/**
	 * Space 기반 타임라인 목록 조회 (세션 수 포함)
	 */
	async findManyTimelines(params: {
		spaceIds?: bigint[];
		skip: number;
		take: number;
		search?: string | null;
		contentLanguageCode?: LanguageCode;
	}) {
		this.logger.debug(
			`타임라인 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개`,
		);

		const where: Prisma.TimelineWhereInput = {
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
			removedAt: null,
			...(params.search
				? { name: { contains: params.search, mode: "insensitive" } }
				: {}),
		};

		const [timelines, total] = await Promise.all([
			this.txHost.tx.timeline.findMany({
				where,
				include: {
					_count: {
						select: { sessions: { where: { removedAt: null } } },
					},
					createdBy: { select: { id: true, name: true } },
					space: { select: { id: true } },
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.timeline.count({ where }),
		]);

		return [toDomainData(timelines), total] as const;
	}

	/**
	 * ID와 spaceId로 타임라인 단건 조회 (createdBy, space, 세션 수 포함)
	 */
	async findTimelineById(timelineId: bigint, spaceIds?: bigint[]) {
		this.logger.debug(`타임라인 상세 조회: ${timelineId.toString()}`);

		const timeline = await this.txHost.tx.timeline.findFirst({
			where: {
				id: timelineId,
				removedAt: null,
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			},
			include: {
				createdBy: { select: { id: true, name: true } },
				space: { select: { id: true } },
				_count: {
					select: { sessions: { where: { removedAt: null } } },
				},
			},
		});

		return timeline ? toDomainData(timeline) : null;
	}

	/**
	 * 타임라인 생성
	 */
	async createTimeline(data: {
		name: string;
		description?: string | null;
		spaceId: bigint;
		createdById: bigint;
	}) {
		this.logger.debug("타임라인 생성");

		const timeline = await this.txHost.tx.timeline.create({
			data: {
				name: data.name,
				description: data.description,
				spaceId: data.spaceId,
				createdById: data.createdById,
			},
			include: {
				space: { select: { id: true } },
				createdBy: { select: { id: true, name: true } },
			},
		});

		return toDomainData(timeline);
	}

	/**
	 * 타임라인 수정
	 */
	async updateTimeline(
		timelineId: bigint,
		data: { name?: string; description?: string | null },
	) {
		this.logger.debug(`타임라인 수정: ${timelineId}`);

		const timeline = await this.txHost.tx.timeline.update({
			where: { id: timelineId },
			data,
		});

		return toDomainData(timeline);
	}

	/**
	 * 타임라인 소프트 삭제
	 */
	async softDeleteTimeline(timelineId: bigint): Promise<void> {
		this.logger.debug(`타임라인 소프트 삭제: ${timelineId}`);

		await this.txHost.tx.timeline.update({
			where: { id: timelineId },
			data: { removedAt: new Date() },
		});
	}

	/**
	 * Space 내 동일 이름 타임라인 수 조회 (이름 중복 확인용)
	 */
	async countTimelinesWithName(
		name: string,
		spaceId: bigint,
		excludeId?: bigint,
	): Promise<number> {
		return this.txHost.tx.timeline.count({
			where: {
				name,
				spaceId,
				removedAt: null,
				...(excludeId ? { id: { not: excludeId } } : {}),
			},
		});
	}

	// ============================================================================
	// Session 쿼리
	// ============================================================================

	/**
	 * 타임라인 기반 세션 목록 조회 (프로그램 수 포함)
	 */
	async findManySessions(
		timelineId: bigint,
		params: { skip: number; take: number; search?: string | null },
	) {
		this.logger.debug(`세션 목록 조회: timelineId=${timelineId.toString()}`);

		const where: Prisma.SessionWhereInput = {
			timelineId,
			removedAt: null,
			...(params.search
				? { name: { contains: params.search, mode: "insensitive" } }
				: {}),
		};

		const [sessions, total] = await Promise.all([
			this.txHost.tx.session.findMany({
				where,
				include: {
					timeline: { select: { id: true } },
					_count: {
						select: { programs: { where: { removedAt: null } } },
					},
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.session.count({ where }),
		]);

		return [toDomainData(sessions), total] as const;
	}

	/**
	 * timelineId + sessionId로 세션 단건 조회 (timeline 관계 포함)
	 */
	async findSessionById(timelineId: bigint, sessionId: bigint) {
		this.logger.debug(`세션 상세 조회: ${sessionId.toString()}`);

		const session = await this.txHost.tx.session.findFirst({
			where: {
				id: sessionId,
				timelineId,
				removedAt: null,
			},
			include: {
				timeline: { select: { id: true, name: true } },
				_count: {
					select: { programs: { where: { removedAt: null } } },
				},
			},
		});

		return session ? toDomainData(session) : null;
	}

	/**
	 * 세션 생성
	 */
	async createSession(
		data: AutoIdentityCreateInput<
			Prisma.SessionUncheckedCreateInput,
			"sessionId"
		>,
	) {
		this.logger.debug("세션 생성");
		const session = await this.txHost.tx.session.create({
			data,
			include: { timeline: { select: { id: true } } },
		});

		return toDomainData(session);
	}

	/**
	 * 세션 수정
	 */
	async updateSession(
		sessionId: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.SessionUncheckedUpdateInput,
			"sessionId"
		>,
	) {
		this.logger.debug(`세션 수정: ${sessionId.toString()}`);
		const session = await this.txHost.tx.session.update({
			where: { id: sessionId },
			data,
			include: { timeline: { select: { id: true } } },
		});

		return toDomainData(session);
	}

	/**
	 * 세션 소프트 삭제
	 */
	async softDeleteSession(sessionId: bigint): Promise<void> {
		this.logger.debug(`세션 소프트 삭제: ${sessionId.toString()}`);

		await this.txHost.tx.session.update({
			where: { id: sessionId },
			data: { removedAt: new Date() },
		});
	}

	// ============================================================================
	// Program 쿼리
	// ============================================================================

	/**
	 * 세션 기반 프로그램 목록 조회
	 */
	async findManyPrograms(
		sessionId: bigint,
		params: { skip: number; take: number },
	) {
		this.logger.debug(`프로그램 목록 조회: sessionId=${sessionId.toString()}`);

		const where: Prisma.ProgramWhereInput = {
			sessionId,
			removedAt: null,
		};

		const [programs, total] = await Promise.all([
			this.txHost.tx.program.findMany({
				where,
				include: {
					programActivities: {
						where: { removedAt: null },
						select: {
							exerciseName: true,
							order: true,
						},
						orderBy: { order: "asc" },
					},
					routine: { select: { id: true, name: true, label: true } },
					session: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.program.count({ where }),
		]);

		const records = programs.map((program) => {
			const programRecord = omitProgramActivities(program);
			const programActivities = program.programActivities;
			return {
				...programRecord,
				activityCount: programActivities.length,
				previewExerciseNames: programActivities
					.slice(0, 3)
					.map((activity) => activity.exerciseName),
			};
		});

		return [toDomainData(records), total] as const;
	}

	/**
	 * sessionId + programId로 프로그램 단건 조회 (routine, session 포함)
	 */
	async findProgramById(sessionId: bigint, programId: bigint) {
		this.logger.debug(`프로그램 상세 조회: ${programId.toString()}`);

		return this.txHost.tx.program
			.findFirst({
				where: {
					id: programId,
					sessionId,
					removedAt: null,
				},
				include: {
					programActivities: {
						where: { removedAt: null },
						orderBy: { order: "asc" },
					},
					routine: { select: { id: true, name: true, label: true } },
					session: {
						select: {
							id: true,
							name: true,
							timeline: { select: { id: true, name: true } },
						},
					},
				},
			})
			.then((program) => {
				if (!program) {
					return null;
				}

				const programRecord = omitProgramActivities(program);
				const programActivities = program.programActivities;
				return toDomainData({
					...programRecord,
					activityCount: programActivities.length,
					previewExerciseNames: programActivities
						.slice(0, 3)
						.map((activity) => activity.exerciseName),
					executionPlan: programActivities,
				});
			});
	}

	/**
	 * 프로그램 생성
	 */
	async createProgram(data: {
		name: string;
		routineId: bigint;
		sessionId: bigint;
		instructorId: bigint;
		capacity: number;
		level?: string | null;
		routineNameSnapshot?: string | null;
		routineLabelSnapshot?: string | null;
	}) {
		this.logger.debug("프로그램 생성");

		const program = await this.txHost.tx.program.create({
			data: {
				name: data.name,
				routineId: data.routineId,
				sessionId: data.sessionId,
				instructorId: data.instructorId,
				capacity: data.capacity,
				level: data.level,
				routineNameSnapshot: data.routineNameSnapshot,
				routineLabelSnapshot: data.routineLabelSnapshot,
			},
			include: {
				routine: { select: { id: true } },
				session: { select: { id: true } },
			},
		});

		return toDomainData(program);
	}

	/**
	 * 프로그램 수정
	 */
	async updateProgram(
		programId: bigint,
		data: {
			name?: string;
			routineId?: bigint;
			instructorId?: bigint;
			capacity?: number;
			level?: string | null;
			routineNameSnapshot?: string | null;
			routineLabelSnapshot?: string | null;
		},
	) {
		this.logger.debug(`프로그램 수정: ${programId}`);
		const program = await this.txHost.tx.program.update({
			where: { id: programId },
			data,
			include: {
				routine: { select: { id: true } },
				session: { select: { id: true } },
			},
		});

		return toDomainData(program);
	}

	/**
	 * 프로그램 소프트 삭제
	 */
	async softDeleteProgram(programId: bigint): Promise<void> {
		this.logger.debug(`프로그램 소프트 삭제: ${programId}`);

		const removedAt = new Date();

		await this.txHost.tx.program.update({
			where: { id: programId },
			data: { removedAt },
		});
		await this.txHost.tx.programActivity.updateMany({
			where: {
				programId,
				removedAt: null,
			},
			data: { removedAt },
		});
	}

	async createProgramActivities(
		programId: bigint,
		activities: {
			taskId: bigint;
			order: number;
			repetitions: number;
			restTime: number;
			notes?: string | null;
			exerciseName: string;
			exerciseDescription?: string | null;
			exerciseDuration: number;
			exerciseCount: number;
			imageFileId?: string | null;
			videoFileId?: string | null;
		}[],
	): Promise<void> {
		if (activities.length === 0) {
			return;
		}

		await this.txHost.tx.programActivity.createMany({
			data: activities.map((activity) => ({
				programId,
				taskId: activity.taskId,
				order: activity.order,
				repetitions: activity.repetitions,
				restTime: activity.restTime,
				notes: activity.notes ?? null,
				exerciseName: activity.exerciseName,
				exerciseDescription: activity.exerciseDescription ?? null,
				exerciseDuration: activity.exerciseDuration,
				exerciseCount: activity.exerciseCount,
				imageFileId: activity.imageFileId ?? null,
				videoFileId: activity.videoFileId ?? null,
			})),
		});
	}

	async replaceProgramActivities(
		programId: bigint,
		activities: {
			taskId: bigint;
			order: number;
			repetitions: number;
			restTime: number;
			notes?: string | null;
			exerciseName: string;
			exerciseDescription?: string | null;
			exerciseDuration: number;
			exerciseCount: number;
			imageFileId?: string | null;
			videoFileId?: string | null;
		}[],
	): Promise<void> {
		await this.txHost.tx.programActivity.deleteMany({
			where: { programId },
		});
		await this.createProgramActivities(programId, activities);
	}

	/**
	 * 세션 내 동일 루틴 프로그램 수 조회 (루틴 중복 확인용)
	 */
	async countProgramsWithRoutine(
		sessionId: bigint,
		routineId: bigint,
		excludeId?: bigint,
	): Promise<number> {
		return this.txHost.tx.program.count({
			where: {
				sessionId,
				routineId,
				removedAt: null,
				...(excludeId ? { id: { not: excludeId } } : {}),
			},
		});
	}
}
