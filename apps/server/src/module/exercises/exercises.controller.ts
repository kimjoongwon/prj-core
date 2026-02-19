import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS, EXERCISE_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateExerciseDto,
	ExerciseDto,
	GetExercisesQueryDto,
	RoutineDto,
	SpaceScope,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { Exercise, Routine } from "@cocrepo/entity";
import { ExercisesService } from "@cocrepo/service";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import { RolesGuard } from "@cocrepo/be-common";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";
import { User } from "@cocrepo/entity";

@ApiTags("EXERCISES")
@Controller()
export class ExercisesController {
	constructor(
		private readonly exercisesService: ExercisesService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException("Space가 선택되지 않았습니다");
		}
		return spaceId;
	}

	/**
	 * 현재 로그인한 사용자를 가져옵니다.
	 */
	private getCurrentUser(): User {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException("로그인이 필요합니다");
		}
		return user;
	}

	/**
	 * 운동 종목 목록 조회
	 * GET /api/v1/exercises
	 */
	@Get()
	@ApiOperation({
		operationId: "getExercises",
		summary: "운동 종목 목록 조회",
		description:
			"운동 종목 목록을 조회합니다. 페이지네이션, 검색, Space 범위 필터를 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("운동 종목 목록 조회 성공")
	async getExercises(@Query() query: GetExercisesQueryDto) {
		const spaceId = this.getSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const spaceScope = query.spaceScope ?? SpaceScope.CURRENT;

		const { exercises, total } = await this.exercisesService.findExercises({
			spaceId,
			spaceScope,
			skip,
			take,
			search: query.search,
		});

		return wrapResponse(exercises, {
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		});
	}

	/**
	 * 운동 종목 상세 조회
	 * GET /api/v1/exercises/:exerciseId
	 */
	@Get(":exerciseId")
	@ApiOperation({
		operationId: "getExercise",
		summary: "운동 종목 상세 조회",
		description:
			"운동 종목 상세 정보를 조회합니다. 상위 Space 공유 운동도 조회 가능합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "exerciseId",
		description: "운동 종목 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 404, message: EXERCISE_ERRORS.EXERCISE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	@ResponseMessage("운동 종목 상세 조회 성공")
	async getExercise(
		@Param("exerciseId", ParseUUIDPipe) exerciseId: string,
	): Promise<Exercise> {
		const spaceId = this.getSpaceId();
		return this.exercisesService.findExerciseById(
			exerciseId,
			spaceId,
			SpaceScope.INCLUDE_ANCESTORS,
		);
	}

	/**
	 * 운동 종목 관련 루틴 목록 조회
	 * GET /api/v1/exercises/:exerciseId/routines
	 */
	@Get(":exerciseId/routines")
	@ApiOperation({
		operationId: "getExerciseRoutines",
		summary: "운동 종목 관련 루틴 목록 조회",
		description: "특정 운동 종목을 Activity로 포함하는 루틴 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "exerciseId",
		description: "운동 종목 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 404, message: EXERCISE_ERRORS.EXERCISE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("운동 종목 관련 루틴 목록 조회 성공")
	async getExerciseRoutines(
		@Param("exerciseId", ParseUUIDPipe) exerciseId: string,
	): Promise<Routine[]> {
		const spaceId = this.getSpaceId();
		return this.exercisesService.findExerciseRoutines(exerciseId, spaceId);
	}

	/**
	 * 운동 종목 등록
	 * POST /api/v1/exercises
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createExercise",
		summary: "운동 종목 등록",
		description:
			"새로운 운동 종목을 등록합니다. Task와 Exercise를 함께 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateExerciseDto,
		description: "등록할 운동 종목 정보",
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: "권한이 없습니다" },
		500,
	)
	@ApiResponseEntity(ExerciseDto, HttpStatus.CREATED)
	@ResponseMessage("운동 종목 등록 성공")
	async createExercise(@Body() dto: CreateExerciseDto): Promise<Exercise> {
		const spaceId = this.getSpaceId();
		const user = this.getCurrentUser();

		return this.exercisesService.createExercise(dto, spaceId, user.id);
	}

	/**
	 * 운동 종목 수정
	 * PATCH /api/v1/exercises/:exerciseId
	 */
	@Patch(":exerciseId")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateExercise",
		summary: "운동 종목 수정",
		description:
			"운동 종목 정보를 수정합니다. 현재 Space가 소유한 운동 종목만 수정 가능합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "exerciseId",
		description: "운동 종목 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateExerciseDto,
		description: "수정할 운동 종목 정보",
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: EXERCISE_ERRORS.EXERCISE_NOT_OWNED },
		{ status: 404, message: EXERCISE_ERRORS.EXERCISE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	@ResponseMessage("운동 종목 수정 성공")
	async updateExercise(
		@Param("exerciseId", ParseUUIDPipe) exerciseId: string,
		@Body() dto: UpdateExerciseDto,
	): Promise<Exercise> {
		const spaceId = this.getSpaceId();
		return this.exercisesService.updateExercise(exerciseId, dto, spaceId);
	}

	/**
	 * 운동 종목 삭제 (소프트 삭제)
	 * DELETE /api/v1/exercises/:exerciseId
	 */
	@Delete(":exerciseId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteExercise",
		summary: "운동 종목 삭제",
		description:
			"운동 종목을 삭제합니다. Activity에서 사용 중인 종목은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "exerciseId",
		description: "운동 종목 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: EXERCISE_ERRORS.EXERCISE_NOT_OWNED },
		{ status: 404, message: EXERCISE_ERRORS.EXERCISE_NOT_FOUND },
		{ status: 409, message: EXERCISE_ERRORS.EXERCISE_IN_USE },
		500,
	)
	@ResponseMessage("운동 종목 삭제 성공")
	async deleteExercise(
		@Param("exerciseId", ParseUUIDPipe) exerciseId: string,
	): Promise<void> {
		const spaceId = this.getSpaceId();
		await this.exercisesService.deleteExercise(exerciseId, spaceId);
	}
}
