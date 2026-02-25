import { EXERCISE_ERRORS } from "@cocrepo/constant";
import { SpaceScope } from "@cocrepo/dto";
import { Exercise, Routine } from "@cocrepo/entity";
import { ExercisesRepository } from "@cocrepo/repository";
import { Transactional } from "@nestjs-cls/transactional";
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { SpaceContext } from "@cocrepo/context";

@Injectable()
export class ExercisesService {
	private readonly logger = new Logger(ExercisesService.name);

	constructor(
		private readonly exercisesRepository: ExercisesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	/**
	 * spaceScope에 따라 조회 범위를 결정하여 운동 종목 목록 조회
	 * - CURRENT: 현재 Space의 운동 종목만 조회
	 * - INCLUDE_ANCESTORS: 현재 Space + 모든 상위 Space의 운동 종목 조회
	 */
	async findExercises(params: {
		spaceId: string;
		spaceScope: SpaceScope;
		skip: number;
		take: number;
		search?: string;
	}): Promise<{ exercises: Exercise[]; total: number }> {
		const { spaceId, spaceScope, skip, take, search } = params;
		this.logger.debug(`운동 종목 목록 조회: spaceScope=${spaceScope}`);

		const spaceIds =
			spaceScope === SpaceScope.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds
				: [spaceId];

		const [exercises, total] =
			await this.exercisesRepository.findManyExercises({
				spaceIds,
				skip,
				take,
				search,
			});

		return { exercises, total };
	}

	/**
	 * 운동 종목 단건 조회
	 * spaceScope 기본값은 INCLUDE_ANCESTORS (상위 Space 공유 자원 접근 허용)
	 */
	async findExerciseById(
		exerciseId: string,
		spaceId: string,
		spaceScope: SpaceScope = SpaceScope.INCLUDE_ANCESTORS,
	): Promise<Exercise> {
		this.logger.debug(`운동 종목 단건 조회: ${exerciseId.slice(-8)}`);

		const spaceIds =
			spaceScope === SpaceScope.INCLUDE_ANCESTORS
				? this.spaceContext.spaceIds
				: [spaceId];

		const exercise = await this.exercisesRepository.findExerciseById(
			exerciseId,
			spaceIds,
		);

		if (!exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
		}

		return exercise;
	}

	/**
	 * 특정 운동 종목을 Activity로 포함하는 루틴 목록 조회
	 */
	async findExerciseRoutines(
		exerciseId: string,
		spaceId: string,
	): Promise<Routine[]> {
		this.logger.debug(`운동 종목 관련 루틴 조회: ${exerciseId.slice(-8)}`);

		// Exercise 존재 여부 확인 (없으면 404)
		await this.findExerciseById(exerciseId, spaceId);

		return this.exercisesRepository.findExerciseRoutines(exerciseId);
	}

	/**
	 * 운동 종목 등록
	 * @Transactional()으로 Task와 Exercise를 하나의 트랜잭션으로 묶어 생성합니다.
	 */
	@Transactional()
	async createExercise(
		dto: {
			name: string;
			duration: number;
			count: number;
			description?: string | null;
			imageFileId?: string | null;
			videoFileId?: string | null;
		},
		spaceId: string,
		creatorId: string,
	): Promise<Exercise> {
		this.logger.debug(`운동 종목 등록: name=${dto.name}`);

		const task = await this.exercisesRepository.createTask({
			spaceId,
			creatorId,
		});

		return this.exercisesRepository.createExercise({
			...dto,
			taskId: task.id,
		});
	}

	/**
	 * 운동 종목 수정
	 * 현재 Space가 소유한 Exercise(task.spaceId === currentSpaceId)만 수정 가능합니다.
	 */
	async updateExercise(
		exerciseId: string,
		dto: {
			name?: string;
			duration?: number;
			count?: number;
			description?: string | null;
			imageFileId?: string | null;
			videoFileId?: string | null;
		},
		spaceId: string,
	): Promise<Exercise> {
		this.logger.debug(`운동 종목 수정: ${exerciseId.slice(-8)}`);

		const exercise = await this.findExerciseById(
			exerciseId,
			spaceId,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		// 현재 Space 소유 여부 확인
		if (exercise.task?.spaceId !== spaceId) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		return this.exercisesRepository.updateExercise(exerciseId, dto);
	}

	/**
	 * 운동 종목 삭제 (소프트 삭제)
	 * - 현재 Space가 소유한 Exercise만 삭제 가능
	 * - Activity에서 사용 중인 Exercise는 삭제 불가
	 * - @Transactional()으로 Exercise + Task 소프트 삭제를 하나의 트랜잭션으로 처리
	 */
	@Transactional()
	async deleteExercise(exerciseId: string, spaceId: string): Promise<void> {
		this.logger.debug(`운동 종목 삭제: ${exerciseId.slice(-8)}`);

		const exercise = await this.findExerciseById(
			exerciseId,
			spaceId,
			SpaceScope.INCLUDE_ANCESTORS,
		);

		// 현재 Space 소유 여부 확인
		if (exercise.task?.spaceId !== spaceId) {
			throw new ForbiddenException(EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
		}

		// Activity 사용 여부 확인
		const activityCount =
			await this.exercisesRepository.countActivitiesUsingExercise(exerciseId);

		if (activityCount > 0) {
			throw new ConflictException(EXERCISE_ERRORS.EXERCISE_IN_USE);
		}

		// Exercise + Task 소프트 삭제 (트랜잭션 내)
		const deleted =
			await this.exercisesRepository.softDeleteExerciseById(exerciseId);
		await this.exercisesRepository.softDeleteTaskById(deleted.taskId);
	}
}
