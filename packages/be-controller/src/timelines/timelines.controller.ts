import {
	CreateProgramCommand,
	CreateSessionCommand,
	CreateTimelineCommand,
	DeleteProgramCommand,
	DeleteSessionCommand,
	DeleteTimelineCommand,
	GetProgramByIdQuery,
	GetProgramsQuery,
	GetSessionByIdQuery,
	GetSessionsQuery,
	GetTimelineByIdQuery,
	GetTimelinesQuery,
	UpdateProgramCommand,
	UpdateSessionCommand,
	UpdateTimelineCommand,
} from "@cocrepo/command";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateProgramDto,
	CreateSessionDto,
	CreateTimelineDto,
	ProgramDto,
	QueryProgramDto,
	QuerySessionDto,
	QueryTimelineDto,
	SessionDto,
	TimelineDto,
	UpdateProgramDto,
	UpdateSessionDto,
	UpdateTimelineDto,
} from "@cocrepo/dto";
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
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TIMELINES")
@Controller()
export class TimelinesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	// ============================================================================
	// Timeline 엔드포인트
	// ============================================================================

	/**
	 * 타임라인 목록 조회
	 * GET /api/v1/timelines
	 */
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getTimelines",
		summary: "타임라인 목록 조회",
		description:
			"현재 Space의 타임라인 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("타임라인 목록 조회 성공")
	async getTimelines(@Query() query: QueryTimelineDto) {
		return this.queryBus.execute(new GetTimelinesQuery(query));
	}

	/**
	 * 타임라인 상세 조회
	 * GET /api/v1/timelines/:timelineId
	 */
	@Get(":timelineId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getTimelineById",
		summary: "타임라인 상세 조회",
		description: "특정 타임라인의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	@ResponseMessage("타임라인 조회 성공")
	async getTimelineById(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
	) {
		return this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
	}

	/**
	 * 타임라인 등록
	 * POST /api/v1/timelines
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createTimeline",
		summary: "타임라인 등록",
		description: "새로운 타임라인을 등록합니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateTimelineDto, description: "등록할 타임라인 정보" })
	@ApiErrors(400, 401, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.CREATED)
	@ResponseMessage("타임라인 생성 성공")
	async createTimeline(@Body() dto: CreateTimelineDto) {
		return this.commandBus.execute(new CreateTimelineCommand(dto));
	}

	/**
	 * 타임라인 수정
	 * PATCH /api/v1/timelines/:timelineId
	 */
	@Patch(":timelineId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateTimeline",
		summary: "타임라인 수정",
		description: "타임라인 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdateTimelineDto, description: "수정할 타임라인 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	@ResponseMessage("타임라인 수정 성공")
	async updateTimeline(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Body() dto: UpdateTimelineDto,
	) {
		return this.commandBus.execute(new UpdateTimelineCommand(timelineId, dto));
	}

	/**
	 * 타임라인 삭제 (소프트 삭제)
	 * DELETE /api/v1/timelines/:timelineId
	 */
	@Delete(":timelineId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteTimeline",
		summary: "타임라인 삭제",
		description:
			"타임라인을 삭제합니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 404, 500)
	@ResponseMessage("타임라인 삭제 성공")
	async deleteTimeline(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
	): Promise<void> {
		await this.commandBus.execute(new DeleteTimelineCommand(timelineId));
	}

	// ============================================================================
	// Session 엔드포인트 (중첩 리소스)
	// ============================================================================

	/**
	 * 세션 목록 조회
	 * GET /api/v1/timelines/:timelineId/sessions
	 */
	@Get(":timelineId/sessions")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getSessions",
		summary: "세션 목록 조회",
		description: "특정 타임라인 내의 세션 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("세션 목록 조회 성공")
	async getSessions(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Query() query: QuerySessionDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		return this.queryBus.execute(new GetSessionsQuery(timelineId, query));
	}

	/**
	 * 세션 상세 조회
	 * GET /api/v1/timelines/:timelineId/sessions/:sessionId
	 */
	@Get(":timelineId/sessions/:sessionId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getSessionById",
		summary: "세션 상세 조회",
		description: "특정 세션의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	@ResponseMessage("세션 조회 성공")
	async getSessionById(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		return this.queryBus.execute(
			new GetSessionByIdQuery(timelineId, sessionId),
		);
	}

	/**
	 * 세션 등록
	 * POST /api/v1/timelines/:timelineId/sessions
	 */
	@Post(":timelineId/sessions")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createSession",
		summary: "세션 등록",
		description: "타임라인에 새로운 세션을 등록합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: CreateSessionDto, description: "등록할 세션 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.CREATED)
	@ResponseMessage("세션 생성 성공")
	async createSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Body() dto: CreateSessionDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		return this.commandBus.execute(new CreateSessionCommand(timelineId, dto));
	}

	/**
	 * 세션 수정
	 * PATCH /api/v1/timelines/:timelineId/sessions/:sessionId
	 */
	@Patch(":timelineId/sessions/:sessionId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateSession",
		summary: "세션 수정",
		description:
			"세션 정보를 수정합니다. 유형 변경 시 관련 필드가 초기화됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiBody({ type: UpdateSessionDto, description: "수정할 세션 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	@ResponseMessage("세션 수정 성공")
	async updateSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Body() dto: UpdateSessionDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		return this.commandBus.execute(
			new UpdateSessionCommand(timelineId, sessionId, dto),
		);
	}

	/**
	 * 세션 삭제 (소프트 삭제)
	 * DELETE /api/v1/timelines/:timelineId/sessions/:sessionId
	 */
	@Delete(":timelineId/sessions/:sessionId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteSession",
		summary: "세션 삭제",
		description:
			"세션을 삭제합니다. 프로그램이 연결된 세션은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(400, 401, 404, 500)
	@ResponseMessage("세션 삭제 성공")
	async deleteSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
	): Promise<void> {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.commandBus.execute(
			new DeleteSessionCommand(timelineId, sessionId),
		);
	}

	// ============================================================================
	// Program 엔드포인트 (중첩 리소스)
	// ============================================================================

	/**
	 * 프로그램 목록 조회
	 * GET /api/v1/timelines/:timelineId/sessions/:sessionId/programs
	 */
	@Get(":timelineId/sessions/:sessionId/programs")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getPrograms",
		summary: "프로그램 목록 조회",
		description: "특정 세션 내의 프로그램 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("프로그램 목록 조회 성공")
	async getPrograms(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Query() query: QueryProgramDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.queryBus.execute(new GetSessionByIdQuery(timelineId, sessionId));
		return this.queryBus.execute(new GetProgramsQuery(sessionId, query));
	}

	/**
	 * 프로그램 상세 조회
	 * GET /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId
	 */
	@Get(":timelineId/sessions/:sessionId/programs/:programId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getProgramById",
		summary: "프로그램 상세 조회",
		description: "특정 프로그램의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({
		name: "programId",
		description: "프로그램 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	@ResponseMessage("프로그램 조회 성공")
	async getProgramById(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.queryBus.execute(new GetSessionByIdQuery(timelineId, sessionId));
		return this.queryBus.execute(new GetProgramByIdQuery(sessionId, programId));
	}

	/**
	 * 프로그램 등록
	 * POST /api/v1/timelines/:timelineId/sessions/:sessionId/programs
	 */
	@Post(":timelineId/sessions/:sessionId/programs")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createProgram",
		summary: "프로그램 등록",
		description:
			"세션에 새로운 프로그램을 등록합니다. 같은 세션 내 동일 루틴은 중복 등록할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiBody({ type: CreateProgramDto, description: "등록할 프로그램 정보" })
	@ApiErrors(400, 401, 404, 409, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.CREATED)
	@ResponseMessage("프로그램 생성 성공")
	async createProgram(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Body() dto: CreateProgramDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.queryBus.execute(new GetSessionByIdQuery(timelineId, sessionId));
		return this.commandBus.execute(new CreateProgramCommand(sessionId, dto));
	}

	/**
	 * 프로그램 수정
	 * PATCH /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId
	 */
	@Patch(":timelineId/sessions/:sessionId/programs/:programId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateProgram",
		summary: "프로그램 수정",
		description:
			"프로그램 정보를 수정합니다. 루틴 변경 시 세션 내 중복 여부를 확인합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({
		name: "programId",
		description: "프로그램 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdateProgramDto, description: "수정할 프로그램 정보" })
	@ApiErrors(400, 401, 404, 409, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	@ResponseMessage("프로그램 수정 성공")
	async updateProgram(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
		@Body() dto: UpdateProgramDto,
	) {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.queryBus.execute(new GetSessionByIdQuery(timelineId, sessionId));
		return this.commandBus.execute(
			new UpdateProgramCommand(sessionId, programId, dto),
		);
	}

	/**
	 * 프로그램 삭제 (소프트 삭제)
	 * DELETE /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId
	 */
	@Delete(":timelineId/sessions/:sessionId/programs/:programId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteProgram",
		summary: "프로그램 삭제",
		description: "프로그램을 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "timelineId",
		description: "타임라인 ID (UUID)",
		type: String,
	})
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({
		name: "programId",
		description: "프로그램 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ResponseMessage("프로그램 삭제 성공")
	async deleteProgram(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
	): Promise<void> {
		await this.queryBus.execute(new GetTimelineByIdQuery(timelineId));
		await this.queryBus.execute(new GetSessionByIdQuery(timelineId, sessionId));
		await this.commandBus.execute(
			new DeleteProgramCommand(sessionId, programId),
		);
	}
}
