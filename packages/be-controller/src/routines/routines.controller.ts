import { ParseUlidPipe, RolesGuard } from "@cocrepo/be-common";
import {
	CreateRoutineCommand,
	DeleteRoutineCommand,
	GetRoutineByIdQuery,
	GetRoutinesQuery,
	UpdateRoutineCommand,
} from "@cocrepo/command";
import { ROUTINE_ERRORS, SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateRoutineDto,
	GetRoutinesQueryDto,
	RoutineDto,
	UpdateRoutineDto,
} from "@cocrepo/dto";
import { Routine } from "@cocrepo/entity";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("ROUTINES")
@Controller()
export class RoutinesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * 루틴 목록 조회
	 * GET /api/v1/routines
	 */
	@Get()
	@ApiOperation({
		operationId: "getRoutines",
		summary: "루틴 목록 조회",
		description:
			"루틴 목록을 조회합니다. 페이지네이션, 검색, Space 범위 필터를 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("루틴 목록 조회 성공")
	async getRoutines(@Query() query: GetRoutinesQueryDto) {
		return this.queryBus.execute(new GetRoutinesQuery(query));
	}

	/**
	 * 루틴 상세 조회
	 * GET /api/v1/routines/:routineId
	 */
	@Get(":routineId")
	@ApiOperation({
		operationId: "getRoutine",
		summary: "루틴 상세 조회",
		description:
			"루틴 상세 정보를 조회합니다. 상위 Space 공유 루틴도 조회 가능합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "routineId",
		description: "루틴 ID (ULID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 404, message: ROUTINE_ERRORS.ROUTINE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	@ResponseMessage("루틴 상세 조회 성공")
	async getRoutine(
		@Param("routineId", ParseUlidPipe) routineId: string,
	): Promise<Routine> {
		return this.queryBus.execute(new GetRoutineByIdQuery(routineId));
	}

	/**
	 * 루틴 등록
	 * POST /api/v1/routines
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "createRoutine",
		summary: "루틴 등록",
		description: "새로운 루틴을 등록합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateRoutineDto,
		description: "등록할 루틴 정보",
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: "권한이 없습니다" },
		500,
	)
	@ApiResponseEntity(RoutineDto, HttpStatus.CREATED)
	@ResponseMessage("루틴 등록 성공")
	async createRoutine(@Body() dto: CreateRoutineDto): Promise<Routine> {
		return this.commandBus.execute(new CreateRoutineCommand(dto));
	}

	/**
	 * 루틴 수정
	 * PATCH /api/v1/routines/:routineId
	 */
	@Patch(":routineId")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "updateRoutine",
		summary: "루틴 수정",
		description:
			"루틴 정보를 수정합니다. 현재 Space가 소유한 루틴만 수정 가능합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "routineId",
		description: "루틴 ID (ULID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoutineDto,
		description: "수정할 루틴 정보",
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: ROUTINE_ERRORS.ROUTINE_NOT_OWNED },
		{ status: 404, message: ROUTINE_ERRORS.ROUTINE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	@ResponseMessage("루틴 수정 성공")
	async updateRoutine(
		@Param("routineId", ParseUlidPipe) routineId: string,
		@Body() dto: UpdateRoutineDto,
	): Promise<Routine> {
		return this.commandBus.execute(new UpdateRoutineCommand(routineId, dto));
	}

	/**
	 * 루틴 삭제 (소프트 삭제)
	 * DELETE /api/v1/routines/:routineId
	 */
	@Delete(":routineId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "deleteRoutine",
		summary: "루틴 삭제",
		description:
			"루틴을 삭제합니다. Program에서 사용 중인 루틴은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "routineId",
		description: "루틴 ID (ULID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "로그인이 필요합니다" },
		{ status: 403, message: ROUTINE_ERRORS.ROUTINE_NOT_OWNED },
		{ status: 404, message: ROUTINE_ERRORS.ROUTINE_NOT_FOUND },
		{ status: 409, message: ROUTINE_ERRORS.ROUTINE_IN_USE },
		500,
	)
	@ResponseMessage("루틴 삭제 성공")
	async deleteRoutine(
		@Param("routineId", ParseUlidPipe) routineId: string,
	): Promise<void> {
		await this.commandBus.execute(new DeleteRoutineCommand(routineId));
	}
}
