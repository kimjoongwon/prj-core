import { ROUTINE_ERRORS, TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import {
	type RecurringDayOfWeek,
	type RepeatCycleTypes,
	SessionTypes,
} from "@cocrepo/prisma";
import {
	RoutinesRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { Transactional } from "@nestjs-cls/transactional";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

interface CreateTimelineInput {
	name: string;
	description?: string | null;
}

interface UpdateTimelineInput {
	name?: string;
	description?: string | null;
}

interface CreateSessionInput {
	name: string;
	type: string;
	description?: string | null;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	repeatCycleType?: string | null;
}

interface UpdateSessionInput {
	name?: string;
	description?: string | null;
	type?: string;
	startDateTime?: Date | null;
	endDateTime?: Date | null;
	recurringDayOfWeek?: string | null;
	repeatCycleType?: string | null;
}

interface CreateProgramInput {
	name: string;
	routineId: string;
	instructorId: string;
	capacity: number;
	level?: string | null;
}

interface UpdateProgramInput {
	name?: string;
	routineId?: string;
	instructorId?: string;
	capacity?: number;
	level?: string | null;
}

interface ProgramActivitySnapshotInput {
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
}

@Injectable()
export class TimelineService {
	private readonly logger = new Logger(TimelineService.name);

	constructor(
		private readonly repository: TimelinesRepository,
		private readonly routinesRepository: RoutinesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	// ============================================================================
	// Timeline 메서드
	// ============================================================================

	/**
	 * Space 기반 타임라인 목록 조회
	 */
	async findTimelines(params: {
		spaceId: string;
		skip: number;
		take: number;
		search?: string | null;
	}) {
		this.logger.debug(`타임라인 목록 조회: spaceId=${params.spaceId.slice(-8)}`);

		const [timelines, total] = await this.repository.findManyTimelines(params);
		return { timelines, total };
	}

	/**
	 * 인증된 Space 기반 타임라인 단건 조회 (상세 정보 포함)
	 * - spaceId 기준으로 Space 격리 적용
	 * - 없으면 NotFoundException 발생
	 */
	async findTimelineForSpace(timelineId: string, spaceId: string) {
		this.logger.debug(`타임라인 상세 조회: ${timelineId.slice(-8)}`);

		const timeline = await this.repository.findTimelineById(timelineId, spaceId);
		if (!timeline) {
			throw new NotFoundException(TIMELINE_ERRORS.TIMELINE_NOT_FOUND);
		}
		return timeline;
	}

	/**
	 * Space에 타임라인 생성
	 * - 같은 Space 내 이름 중복 확인 후 생성
	 */
	async createTimeline(
		input: CreateTimelineInput,
		spaceId: string,
		creatorId: string,
	) {
		this.logger.debug(`타임라인 생성: name=${input.name}`);

		const duplicateCount = await this.repository.countTimelinesWithName(
			input.name,
			spaceId,
		);
		if (duplicateCount > 0) {
			throw new BadRequestException(TIMELINE_ERRORS.TIMELINE_NAME_DUPLICATED);
		}

		return this.repository.createTimeline({
			name: input.name,
			description: input.description ?? null,
			spaceId,
			creatorId,
		});
	}

	/**
	 * Space 소유권 확인 후 타임라인 수정
	 * - 이름 변경 시 중복 확인 (자기 자신 제외)
	 */
	async updateTimelineForSpace(
		timelineId: string,
		input: UpdateTimelineInput,
		spaceId: string,
	) {
		this.logger.debug(`타임라인 수정: ${timelineId.slice(-8)}`);

		const timeline = await this.findTimelineForSpace(timelineId, spaceId);

		if (input.name && input.name !== timeline.name) {
			const duplicateCount = await this.repository.countTimelinesWithName(
				input.name,
				spaceId,
				timelineId,
			);
			if (duplicateCount > 0) {
				throw new BadRequestException(TIMELINE_ERRORS.TIMELINE_NAME_DUPLICATED);
			}
		}

		const updateData: { name?: string; description?: string | null } = {};
		if (input.name !== undefined) updateData.name = input.name;
		if (input.description !== undefined) updateData.description = input.description;

		return this.repository.updateTimeline(timelineId, updateData);
	}

	/**
	 * Space 소유권 확인 후 타임라인 소프트 삭제
	 * - 세션이 있으면 삭제 불가
	 */
	async deleteTimelineFromSpace(timelineId: string, spaceId: string): Promise<void> {
		this.logger.debug(`타임라인 삭제: ${timelineId.slice(-8)}`);

		const timeline = await this.findTimelineForSpace(timelineId, spaceId);

		if (timeline._count.sessions > 0) {
			throw new BadRequestException(TIMELINE_ERRORS.TIMELINE_HAS_SESSIONS);
		}

		await this.repository.softDeleteTimeline(timelineId);
	}

	// ============================================================================
	// Session 메서드
	// ============================================================================

	/**
	 * 타임라인 내 세션 목록 조회
	 */
	async findSessionsInTimeline(
		timelineId: string,
		params: { skip: number; take: number; search?: string | null },
	) {
		this.logger.debug(`세션 목록 조회: timelineId=${timelineId.slice(-8)}`);

		const [sessions, total] = await this.repository.findManySessions(
			timelineId,
			params,
		);
		return { sessions, total };
	}

	/**
	 * 타임라인 내 세션 단건 조회
	 * - 없으면 NotFoundException 발생
	 */
	async findSessionInTimeline(timelineId: string, sessionId: string) {
		this.logger.debug(`세션 상세 조회: ${sessionId.slice(-8)}`);

		const session = await this.repository.findSessionById(timelineId, sessionId);
		if (!session) {
			throw new NotFoundException(TIMELINE_ERRORS.SESSION_NOT_FOUND);
		}
		return session;
	}

	/**
	 * 타임라인에 세션 생성
	 * - 세션 유형별 필드 유효성 검증
	 */
	async createSessionInTimeline(timelineId: string, input: CreateSessionInput) {
		this.logger.debug(`세션 생성: timelineId=${timelineId.slice(-8)}, type=${input.type}`);

		this.validateSessionTypeConstraints(input);

		return this.repository.createSession({
			name: input.name,
			type: input.type as SessionTypes,
			timelineId,
			description: input.description ?? null,
			startDateTime: input.startDateTime ?? null,
			endDateTime: input.endDateTime ?? null,
			recurringDayOfWeek: (input.recurringDayOfWeek as RecurringDayOfWeek) ?? null,
			repeatCycleType: (input.repeatCycleType as RepeatCycleTypes) ?? null,
		});
	}

	/**
	 * 타임라인 내 세션 수정
	 * - 세션 존재 확인
	 * - 유형 변경 시 이전 유형 관련 필드 null 초기화
	 * - 유형별 필드 유효성 검증
	 */
	async updateSessionInTimeline(
		timelineId: string,
		sessionId: string,
		input: UpdateSessionInput,
	) {
		this.logger.debug(`세션 수정: ${sessionId.slice(-8)}`);

		const existing = await this.findSessionInTimeline(timelineId, sessionId);

		const updateData: {
			name?: string;
			description?: string | null;
			type?: SessionTypes;
			startDateTime?: Date | null;
			endDateTime?: Date | null;
			recurringDayOfWeek?: RecurringDayOfWeek | null;
			repeatCycleType?: RepeatCycleTypes | null;
		} = {};

		if (input.name !== undefined) updateData.name = input.name;
		if (input.description !== undefined) updateData.description = input.description;

		// 유형 변경 시 이전 유형 관련 필드 초기화
		if (input.type !== undefined && input.type !== existing.type) {
			updateData.type = input.type as SessionTypes;
			updateData.startDateTime = null;
			updateData.endDateTime = null;
			updateData.recurringDayOfWeek = null;
			updateData.repeatCycleType = null;
		}

		// 날짜/반복 필드 업데이트 (유형 변경과 별개로)
		if (input.startDateTime !== undefined) {
			updateData.startDateTime = input.startDateTime;
		}
		if (input.endDateTime !== undefined) updateData.endDateTime = input.endDateTime;
		if (input.recurringDayOfWeek !== undefined) {
			updateData.recurringDayOfWeek =
				(input.recurringDayOfWeek as RecurringDayOfWeek) ?? null;
		}
		if (input.repeatCycleType !== undefined) {
			updateData.repeatCycleType =
				(input.repeatCycleType as RepeatCycleTypes) ?? null;
		}

		// 최종 상태 기준으로 유효성 검증
		const finalType = updateData.type ?? existing.type;
		const finalStartDateTime =
			updateData.startDateTime !== undefined
				? updateData.startDateTime
				: existing.startDateTime;
		const finalEndDateTime =
			updateData.endDateTime !== undefined
				? updateData.endDateTime
				: existing.endDateTime;
		const finalRecurringDayOfWeek =
			updateData.recurringDayOfWeek !== undefined
				? updateData.recurringDayOfWeek
				: existing.recurringDayOfWeek;
		const finalRepeatCycleType =
			updateData.repeatCycleType !== undefined
				? updateData.repeatCycleType
				: existing.repeatCycleType;

		this.validateSessionTypeConstraints({
			type: finalType,
			startDateTime: finalStartDateTime,
			endDateTime: finalEndDateTime,
			recurringDayOfWeek: finalRecurringDayOfWeek,
			repeatCycleType: finalRepeatCycleType,
		});

		return this.repository.updateSession(sessionId, updateData);
	}

	/**
	 * 타임라인 내 세션 소프트 삭제
	 * - 프로그램이 있으면 삭제 불가
	 */
	async deleteSessionFromTimeline(timelineId: string, sessionId: string): Promise<void> {
		this.logger.debug(`세션 삭제: ${sessionId.slice(-8)}`);

		const session = await this.findSessionInTimeline(timelineId, sessionId);

		if (session._count.programs > 0) {
			throw new BadRequestException(TIMELINE_ERRORS.SESSION_HAS_PROGRAMS);
		}

		await this.repository.softDeleteSession(sessionId);
	}

	// ============================================================================
	// Program 메서드
	// ============================================================================

	/**
	 * 세션 내 프로그램 목록 조회
	 */
	async findProgramsInSession(
		sessionId: string,
		params: { skip: number; take: number },
	) {
		this.logger.debug(`프로그램 목록 조회: sessionId=${sessionId.slice(-8)}`);

		const [programs, total] = await this.repository.findManyPrograms(
			sessionId,
			params,
		);
		return { programs, total };
	}

	/**
	 * 세션 내 프로그램 단건 조회
	 * - 없으면 NotFoundException 발생
	 */
	async findProgramInSession(sessionId: string, programId: string) {
		this.logger.debug(`프로그램 상세 조회: ${programId.slice(-8)}`);

		const program = await this.repository.findProgramById(sessionId, programId);
		if (!program) {
			throw new NotFoundException(TIMELINE_ERRORS.PROGRAM_NOT_FOUND);
		}
		return program;
	}

	/**
	 * 세션에 프로그램 생성
	 * - 같은 세션 내 루틴 중복 확인
	 */
	@Transactional()
	async createProgramInSession(sessionId: string, input: CreateProgramInput) {
		this.logger.debug(`프로그램 생성: sessionId=${sessionId.slice(-8)}`);

		const duplicateCount = await this.repository.countProgramsWithRoutine(
			sessionId,
			input.routineId,
		);
		if (duplicateCount > 0) {
			throw new BadRequestException(TIMELINE_ERRORS.PROGRAM_ROUTINE_DUPLICATED);
		}

		const routineSnapshot = await this.getRoutineExecutionSnapshot(
			input.routineId,
		);

		const createdProgram = await this.repository.createProgram({
			name: input.name,
			routineId: input.routineId,
			sessionId,
			instructorId: input.instructorId,
			capacity: input.capacity,
			level: input.level ?? null,
			routineNameSnapshot: routineSnapshot.routine.name,
			routineLabelSnapshot: routineSnapshot.routine.label,
		});
		await this.repository.createProgramActivities(
			createdProgram.id,
			routineSnapshot.activities,
		);

		return this.findProgramInSession(sessionId, createdProgram.id);
	}

	/**
	 * 세션 내 프로그램 수정
	 * - routineId 변경 시 세션 내 중복 확인
	 */
	@Transactional()
	async updateProgramInSession(
		sessionId: string,
		programId: string,
		input: UpdateProgramInput,
	) {
		this.logger.debug(`프로그램 수정: ${programId.slice(-8)}`);

		const existingProgram = await this.findProgramInSession(sessionId, programId);

		const hasRoutineChanged =
			input.routineId !== undefined &&
			input.routineId !== existingProgram.routineId;

		if (hasRoutineChanged && input.routineId) {
			const duplicateCount = await this.repository.countProgramsWithRoutine(
				sessionId,
				input.routineId,
				programId,
			);
			if (duplicateCount > 0) {
				throw new BadRequestException(TIMELINE_ERRORS.PROGRAM_ROUTINE_DUPLICATED);
			}
		}

		const routineSnapshot =
			hasRoutineChanged && input.routineId
				? await this.getRoutineExecutionSnapshot(input.routineId)
				: null;

		const updateData: UpdateProgramInput & {
			routineNameSnapshot?: string | null;
			routineLabelSnapshot?: string | null;
		} = {};

		if (input.name !== undefined) updateData.name = input.name;
		if (input.instructorId !== undefined) updateData.instructorId = input.instructorId;
		if (input.capacity !== undefined) updateData.capacity = input.capacity;
		if (input.level !== undefined) updateData.level = input.level;

		if (input.routineId !== undefined) {
			updateData.routineId = input.routineId;
		}
		if (routineSnapshot) {
			updateData.routineNameSnapshot = routineSnapshot.routine.name;
			updateData.routineLabelSnapshot = routineSnapshot.routine.label;
		}

		await this.repository.updateProgram(programId, updateData);

		if (routineSnapshot) {
			await this.repository.replaceProgramActivities(
				programId,
				routineSnapshot.activities,
			);
		}

		return this.findProgramInSession(sessionId, programId);
	}

	/**
	 * 세션 내 프로그램 소프트 삭제
	 */
	@Transactional()
	async deleteProgramFromSession(sessionId: string, programId: string): Promise<void> {
		this.logger.debug(`프로그램 삭제: ${programId.slice(-8)}`);

		await this.findProgramInSession(sessionId, programId);
		await this.repository.softDeleteProgram(programId);
	}

	// ============================================================================
	// Private 메서드
	// ============================================================================

	/**
	 * 세션 유형별 필드 유효성 검증
	 * - ONE_TIME: startDateTime 필수
	 * - ONE_TIME_RANGE: startDateTime, endDateTime 필수 + endDateTime > startDateTime
	 * - RECURRING: recurringDayOfWeek, repeatCycleType 필수
	 * - 날짜 범위: endDateTime > startDateTime 확인
	 */
	private validateSessionTypeConstraints(input: {
		type?: string | null;
		startDateTime?: Date | null;
		endDateTime?: Date | null;
		recurringDayOfWeek?: string | null;
		repeatCycleType?: string | null;
	}): void {
		const { type, startDateTime, endDateTime, recurringDayOfWeek, repeatCycleType } =
			input;

		if (!type) return;

		if (type === SessionTypes.ONE_TIME) {
			if (!startDateTime) {
				throw new BadRequestException(
					"일회성(ONE_TIME) 세션은 시작 일시(startDateTime)가 필수입니다",
				);
			}
		} else if (type === SessionTypes.ONE_TIME_RANGE) {
			if (!startDateTime) {
				throw new BadRequestException(
					"기간형(ONE_TIME_RANGE) 세션은 시작 일시(startDateTime)가 필수입니다",
				);
			}
			if (!endDateTime) {
				throw new BadRequestException(
					"기간형(ONE_TIME_RANGE) 세션은 종료 일시(endDateTime)가 필수입니다",
				);
			}
		} else if (type === SessionTypes.RECURRING) {
			if (!recurringDayOfWeek) {
				throw new BadRequestException(
					"반복(RECURRING) 세션은 반복 요일(recurringDayOfWeek)이 필수입니다",
				);
			}
			if (!repeatCycleType) {
				throw new BadRequestException(
					"반복(RECURRING) 세션은 반복 주기(repeatCycleType)가 필수입니다",
				);
			}
		}

		// 날짜 범위 검증 (시작일과 종료일이 모두 있을 때)
		if (startDateTime && endDateTime) {
			if (endDateTime <= startDateTime) {
				throw new BadRequestException(TIMELINE_ERRORS.SESSION_DATE_INVALID);
			}
		}
	}

	private getAccessibleSpaceIds(): string[] {
		return (
			this.spaceContext.spaceIds ??
			(this.spaceContext.spaceId ? [this.spaceContext.spaceId] : [])
		);
	}

	private async getRoutineExecutionSnapshot(routineId: string): Promise<{
		routine: {
			name: string;
			label: string;
		};
		activities: ProgramActivitySnapshotInput[];
	}> {
		const routine = await this.routinesRepository.findRoutineById(
			routineId,
			this.getAccessibleSpaceIds(),
		);

		if (!routine) {
			throw new NotFoundException(ROUTINE_ERRORS.ROUTINE_NOT_FOUND);
		}

		const routineActivities = [...(routine.activities ?? [])].sort(
			(left, right) => left.order - right.order,
		);

		const hasUnschedulableExercise = routineActivities.some(
			(activity) => !activity.task?.exercise?.videoFileId,
		);
		if (hasUnschedulableExercise) {
			throw new BadRequestException(
				TIMELINE_ERRORS.PROGRAM_ROUTINE_EXERCISE_INCOMPLETE,
			);
		}

		return {
			routine: {
				name: routine.name,
				label: routine.label,
			},
			activities: routineActivities.map((activity) => ({
				taskId: activity.taskId,
				order: activity.order,
				repetitions: activity.repetitions,
				restTime: activity.restTime,
				notes: activity.notes ?? null,
				exerciseName: activity.task?.exercise?.name ?? "",
				exerciseDescription: activity.task?.exercise?.description ?? null,
				exerciseDuration: activity.task?.exercise?.duration ?? 0,
				exerciseCount: activity.task?.exercise?.count ?? 0,
				imageFileId: activity.task?.exercise?.imageFileId ?? null,
				videoFileId: activity.task?.exercise?.videoFileId ?? null,
			})),
		};
	}
}
