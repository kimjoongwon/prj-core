import { ROUTINE_ERRORS } from "@cocrepo/constant";
import { SpaceScope } from "@cocrepo/dto";
import { Routine } from "@cocrepo/entity";
import { RoutinesRepository, TasksRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { SpaceContext } from "@cocrepo/context";

@Injectable()
export class RoutineService {
	private readonly logger = new Logger(RoutineService.name);

	private readonly DEFAULT_ACTIVITY_REPETITIONS = 1;
	private readonly DEFAULT_ACTIVITY_REST_TIME = 0;

	constructor(
		private readonly routinesRepository: RoutinesRepository,
		private readonly tasksRepository: TasksRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	/**
	 * spaceScope에 따라 조회 범위를 결정하여 루틴 목록 조회
	 * - CURRENT: 현재 Space의 루틴만 조회
	 * - INCLUDE_ANCESTORS: 현재 Space + 모든 상위 Space의 루틴 조회
	 */
	async findRoutines(params: {
		spaceScope?: SpaceScope;
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ routines: Routine[]; total: number }> {
		const {
			spaceScope = SpaceScope.INCLUDE_ANCESTORS,
			skip,
			take,
			search,
		} = params;
		this.logger.debug(`루틴 목록 조회: spaceScope=${spaceScope}`);

		const spaceId = this.spaceContext.spaceId;
		const spaceIds =
			spaceScope === SpaceScope.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds
				: spaceId
					? [spaceId]
					: [];

		const [routines, total] = await this.routinesRepository.findManyRoutines({
			spaceIds,
			skip,
			take,
			search,
		});

		return { routines, total };
	}

	/**
	 * 루틴 단건 조회
	 * spaceScope 기본값은 INCLUDE_ANCESTORS (상위 Space 공유 자원 접근 허용)
	 */
	async findRoutineById(
		routineId: string,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Routine> {
		this.logger.debug(`루틴 단건 조회: ${routineId.slice(-8)}`);

		const spaceId = this.spaceContext.spaceId;
		const spaceIds =
			spaceScope === SpaceScope.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds
				: spaceId
					? [spaceId]
					: [];

		const routine = await this.routinesRepository.findRoutineById(
			routineId,
			spaceIds,
		);

		if (!routine) {
			throw new NotFoundException(ROUTINE_ERRORS.ROUTINE_NOT_FOUND);
		}

		return routine;
	}

	/**
	 * 루틴 등록
	 * creatorId = 현재 로그인 사용자 ID
	 * spaceId = 현재 Space ID
	 */
	async createRoutine(
		dto: {
			name: string;
			label: string;
			activities?: {
				taskId: string;
				order?: number;
				repetitions?: number;
				restTime?: number;
				notes?: string;
			}[];
		},
		userId: string,
	): Promise<Routine> {
		this.logger.debug(`루틴 등록: name=${dto.name}`);

		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new Error("Space 컨텍스트가 설정되지 않았습니다");
		}

		await this.validateRoutineActivityTasks(dto.activities);

		return this.routinesRepository.createRoutine({
			name: dto.name,
			label: dto.label,
			spaceId,
			creatorId: userId,
			activities: this.normalizeRoutineActivities(dto.activities),
		});
	}

	/**
	 * 루틴 수정
	 * 현재 Space가 소유한 루틴(routine.spaceId === currentSpaceId)만 수정 가능합니다.
	 */
	async updateRoutine(
		routineId: string,
		dto: {
			name?: string;
			label?: string;
			activities?: {
				taskId: string;
				order?: number;
				repetitions?: number;
				restTime?: number;
				notes?: string;
			}[];
		},
	): Promise<Routine> {
		this.logger.debug(`루틴 수정: ${routineId.slice(-8)}`);

		const spaceId = this.spaceContext.spaceId;
		const routine = await this.findRoutineById(
			routineId,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		await this.validateRoutineActivityTasks(dto.activities);

		// 현재 Space 소유 여부 확인
		if (routine.spaceId !== spaceId) {
			throw new ForbiddenException(ROUTINE_ERRORS.ROUTINE_NOT_OWNED);
		}

		return this.routinesRepository.updateRoutine(routineId, {
			name: dto.name,
			label: dto.label,
			activities: this.normalizeRoutineActivities(dto.activities),
		});
	}

	private async validateRoutineActivityTasks(
		activities?: {
			taskId: string;
		}[],
	): Promise<void> {
		if (!activities) {
			return;
		}

		const taskIds = new Set<string>();
		for (const activity of activities) {
			if (taskIds.has(activity.taskId)) {
				throw new ConflictException(
					ROUTINE_ERRORS.ROUTINE_ACTIVITY_TASK_DUPLICATED,
				);
			}
			taskIds.add(activity.taskId);
		}

		const accessibleSpaceIds =
			this.spaceContext.spaceIds ??
			(this.spaceContext.spaceId ? [this.spaceContext.spaceId] : []);
		const tasks = await this.tasksRepository.findTasksByIds(
			Array.from(taskIds),
			accessibleSpaceIds,
		);
		const taskById = new Map(tasks.map((task) => [task.id, task]));

		for (const taskId of taskIds) {
			const task = taskById.get(taskId);
			if (!task?.exercise?.videoFileId) {
				throw new BadRequestException(
					ROUTINE_ERRORS.TASK_EXERCISE_NOT_SCHEDULABLE,
				);
			}
		}
	}

	private normalizeRoutineActivities(
		activities?: {
			taskId: string;
			order?: number;
			repetitions?: number;
			restTime?: number;
			notes?: string;
		}[],
	):
		| {
				taskId: string;
				order: number;
				repetitions: number;
				restTime: number;
				notes?: string;
		  }[]
		| undefined {
		if (activities === undefined) {
			return undefined;
		}

		return activities.map((activity, index) => ({
			taskId: activity.taskId,
			order: activity.order ?? index + 1,
			repetitions: activity.repetitions ?? this.DEFAULT_ACTIVITY_REPETITIONS,
			restTime: activity.restTime ?? this.DEFAULT_ACTIVITY_REST_TIME,
			notes: activity.notes,
		}));
	}

	/**
	 * 루틴 삭제 (소프트 삭제)
	 * - 현재 Space가 소유한 루틴만 삭제 가능
	 * - Program에서 사용 중인 루틴은 삭제 불가
	 */
	async removeRoutine(routineId: string): Promise<void> {
		this.logger.debug(`루틴 삭제: ${routineId.slice(-8)}`);

		const spaceId = this.spaceContext.spaceId;
		const routine = await this.findRoutineById(
			routineId,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		// 현재 Space 소유 여부 확인
		if (routine.spaceId !== spaceId) {
			throw new ForbiddenException(ROUTINE_ERRORS.ROUTINE_NOT_OWNED);
		}

		// Program 사용 여부 확인
		const programCount =
			await this.routinesRepository.countProgramsUsingRoutine(routineId);

		if (programCount > 0) {
			throw new ConflictException(ROUTINE_ERRORS.ROUTINE_IN_USE);
		}

		await this.routinesRepository.softDeleteRoutine(routineId);
	}
}
