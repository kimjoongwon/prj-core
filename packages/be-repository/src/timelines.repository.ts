import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

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
		spaceIds?: string[];
		skip: number;
		take: number;
		search?: string | null;
		contentLanguageCode?: LanguageCode;
	}) {
		this.logger.debug(
			`타임라인 목록 조회: spaceIds=${params.spaceIds?.length ?? "all"}개`,
		);

		const where: Prisma.TimelineWhereInput = {
			...(params.spaceIds ? { spaceId: { in: params.spaceIds } } : {}),
			...(params.contentLanguageCode
				? { space: { contentLanguageCode: params.contentLanguageCode } }
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
					creator: { select: { id: true, name: true } },
				},
				orderBy: { createdAt: "desc" },
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.timeline.count({ where }),
		]);

		return [timelines, total] as const;
	}

	/**
	 * ID와 spaceId로 타임라인 단건 조회 (creator, space, 세션 수 포함)
	 */
	async findTimelineById(timelineId: string, spaceIds?: string[]) {
		this.logger.debug(`타임라인 상세 조회: ${timelineId.slice(-8)}`);

		return this.txHost.tx.timeline.findFirst({
			where: {
				id: timelineId,
				removedAt: null,
				...(spaceIds ? { spaceId: { in: spaceIds } } : {}),
			},
			include: {
				creator: { select: { id: true, name: true } },
				space: { select: { id: true } },
				_count: {
					select: { sessions: { where: { removedAt: null } } },
				},
			},
		});
	}

	/**
	 * 타임라인 생성
	 */
	async createTimeline(data: {
		name: string;
		description?: string | null;
		spaceId: string;
		creatorId: string;
	}) {
		this.logger.debug("타임라인 생성");

		return this.txHost.tx.timeline.create({ data });
	}

	/**
	 * 타임라인 수정
	 */
	async updateTimeline(
		timelineId: string,
		data: { name?: string; description?: string | null },
	) {
		this.logger.debug(`타임라인 수정: ${timelineId.slice(-8)}`);

		return this.txHost.tx.timeline.update({
			where: { id: timelineId },
			data,
		});
	}

	/**
	 * 타임라인 소프트 삭제
	 */
	async softDeleteTimeline(timelineId: string): Promise<void> {
		this.logger.debug(`타임라인 소프트 삭제: ${timelineId.slice(-8)}`);

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
		spaceId: string,
		excludeId?: string,
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
		timelineId: string,
		params: { skip: number; take: number; search?: string | null },
	) {
		this.logger.debug(`세션 목록 조회: timelineId=${timelineId.slice(-8)}`);

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

		return [sessions, total] as const;
	}

	/**
	 * timelineId + sessionId로 세션 단건 조회 (timeline 관계 포함)
	 */
	async findSessionById(timelineId: string, sessionId: string) {
		this.logger.debug(`세션 상세 조회: ${sessionId.slice(-8)}`);

		return this.txHost.tx.session.findFirst({
			where: { id: sessionId, timelineId, removedAt: null },
			include: {
				timeline: { select: { id: true, name: true } },
				_count: {
					select: { programs: { where: { removedAt: null } } },
				},
			},
		});
	}

	/**
	 * 세션 생성
	 */
	async createSession(data: Prisma.SessionUncheckedCreateInput) {
		this.logger.debug("세션 생성");

		return this.txHost.tx.session.create({ data });
	}

	/**
	 * 세션 수정
	 */
	async updateSession(
		sessionId: string,
		data: Prisma.SessionUncheckedUpdateInput,
	) {
		this.logger.debug(`세션 수정: ${sessionId.slice(-8)}`);

		return this.txHost.tx.session.update({
			where: { id: sessionId },
			data,
		});
	}

	/**
	 * 세션 소프트 삭제
	 */
	async softDeleteSession(sessionId: string): Promise<void> {
		this.logger.debug(`세션 소프트 삭제: ${sessionId.slice(-8)}`);

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
		sessionId: string,
		params: { skip: number; take: number },
	) {
		this.logger.debug(`프로그램 목록 조회: sessionId=${sessionId.slice(-8)}`);

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

		return [
			programs.map((program) => {
				const { programActivities, ...rest } = program;
				return {
					...rest,
					activityCount: programActivities.length,
					previewExerciseNames: programActivities
						.slice(0, 3)
						.map((activity) => activity.exerciseName),
				};
			}),
			total,
		] as const;
	}

	/**
	 * sessionId + programId로 프로그램 단건 조회 (routine, session 포함)
	 */
	async findProgramById(sessionId: string, programId: string) {
		this.logger.debug(`프로그램 상세 조회: ${programId.slice(-8)}`);

		return this.txHost.tx.program
			.findFirst({
				where: { id: programId, sessionId, removedAt: null },
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

				const { programActivities, ...rest } = program;
				return {
					...rest,
					activityCount: programActivities.length,
					previewExerciseNames: programActivities
						.slice(0, 3)
						.map((activity) => activity.exerciseName),
					executionPlan: programActivities,
				};
			});
	}

	/**
	 * 프로그램 생성
	 */
	async createProgram(data: {
		name: string;
		routineId: string;
		sessionId: string;
		instructorId: string;
		capacity: number;
		level?: string | null;
		routineNameSnapshot?: string | null;
		routineLabelSnapshot?: string | null;
	}) {
		this.logger.debug("프로그램 생성");

		return this.txHost.tx.program.create({ data });
	}

	/**
	 * 프로그램 수정
	 */
	async updateProgram(
		programId: string,
		data: {
			name?: string;
			routineId?: string;
			instructorId?: string;
			capacity?: number;
			level?: string | null;
			routineNameSnapshot?: string | null;
			routineLabelSnapshot?: string | null;
		},
	) {
		this.logger.debug(`프로그램 수정: ${programId.slice(-8)}`);

		return this.txHost.tx.program.update({
			where: { id: programId },
			data,
		});
	}

	/**
	 * 프로그램 소프트 삭제
	 */
	async softDeleteProgram(programId: string): Promise<void> {
		this.logger.debug(`프로그램 소프트 삭제: ${programId.slice(-8)}`);

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
		programId: string,
		activities: {
			taskId: string;
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
		programId: string,
		activities: {
			taskId: string;
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
		sessionId: string,
		routineId: string,
		excludeId?: string,
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
