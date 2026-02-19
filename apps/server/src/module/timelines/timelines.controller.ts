import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS, TIMELINE_ERRORS } from "@cocrepo/constant";
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
import { User } from "@cocrepo/entity";
import { TimelinesService } from "@cocrepo/service";
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
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

@ApiTags("TIMELINES")
@Controller()
export class TimelinesController {
	constructor(
		private readonly timelinesService: TimelinesService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 Space ID를 CLS 컨텍스트에서 가져옵니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return spaceId;
	}

	/**
	 * 현재 로그인한 사용자를 CLS 컨텍스트에서 가져옵니다.
	 */
	private getCurrentUser(): User {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(TIMELINE_ERRORS.NOT_FOUND);
		}
		return user;
	}

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
		description: "현재 Space의 타임라인 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.timeline.list.success")
	async getTimelines(@Query() query: QueryTimelineDto) {
		const spaceId = this.getSpaceId();
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		const { timelines, total } = await this.timelinesService.findTimelines({
			spaceId,
			skip,
			take,
			search: query.search ?? null,
		});

		return wrapResponse(timelines, {
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
			stats: {
				total,
			},
		});
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	@ResponseMessage("common.timeline.read.success")
	async getTimelineById(@Param("timelineId", ParseUUIDPipe) timelineId: string) {
		const spaceId = this.getSpaceId();
		return this.timelinesService.findTimelineForSpace(timelineId, spaceId);
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
	@ResponseMessage("common.timeline.create.success")
	async createTimeline(@Body() dto: CreateTimelineDto) {
		const spaceId = this.getSpaceId();
		const user = this.getCurrentUser();
		return this.timelinesService.createTimeline(dto, spaceId, user.id);
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiBody({ type: UpdateTimelineDto, description: "수정할 타임라인 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	@ResponseMessage("common.timeline.update.success")
	async updateTimeline(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Body() dto: UpdateTimelineDto,
	) {
		const spaceId = this.getSpaceId();
		return this.timelinesService.updateTimelineForSpace(timelineId, dto, spaceId);
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
		description: "타임라인을 삭제합니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiErrors(400, 401, 404, 500)
	@ResponseMessage("common.timeline.delete.success")
	async deleteTimeline(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
	): Promise<void> {
		const spaceId = this.getSpaceId();
		await this.timelinesService.deleteTimelineFromSpace(timelineId, spaceId);
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.session.list.success")
	async getSessions(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Query() query: QuerySessionDto,
	) {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		const { sessions, total } = await this.timelinesService.findSessionsInTimeline(
			timelineId,
			{ skip, take },
		);

		return wrapResponse(sessions, {
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		});
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	@ResponseMessage("common.session.read.success")
	async getSessionById(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
	) {
		return this.timelinesService.findSessionInTimeline(timelineId, sessionId);
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiBody({ type: CreateSessionDto, description: "등록할 세션 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.CREATED)
	@ResponseMessage("common.session.create.success")
	async createSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Body() dto: CreateSessionDto,
	) {
		return this.timelinesService.createSessionInTimeline(timelineId, dto);
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
		description: "세션 정보를 수정합니다. 유형 변경 시 관련 필드가 초기화됩니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiBody({ type: UpdateSessionDto, description: "수정할 세션 정보" })
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(SessionDto, HttpStatus.OK)
	@ResponseMessage("common.session.update.success")
	async updateSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Body() dto: UpdateSessionDto,
	) {
		return this.timelinesService.updateSessionInTimeline(timelineId, sessionId, dto);
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
		description: "세션을 삭제합니다. 프로그램이 연결된 세션은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(400, 401, 404, 500)
	@ResponseMessage("common.session.delete.success")
	async deleteSession(
		@Param("timelineId", ParseUUIDPipe) timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
	): Promise<void> {
		await this.timelinesService.deleteSessionFromTimeline(timelineId, sessionId);
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.program.list.success")
	async getPrograms(
		@Param("timelineId", ParseUUIDPipe) _timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Query() query: QueryProgramDto,
	) {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		const { programs, total } = await this.timelinesService.findProgramsInSession(
			sessionId,
			{ skip, take },
		);

		return wrapResponse(programs, {
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		});
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({ name: "programId", description: "프로그램 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	@ResponseMessage("common.program.read.success")
	async getProgramById(
		@Param("timelineId", ParseUUIDPipe) _timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
	) {
		return this.timelinesService.findProgramInSession(sessionId, programId);
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
		description: "세션에 새로운 프로그램을 등록합니다. 같은 세션 내 동일 루틴은 중복 등록할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiBody({ type: CreateProgramDto, description: "등록할 프로그램 정보" })
	@ApiErrors(400, 401, 404, 409, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.CREATED)
	@ResponseMessage("common.program.create.success")
	async createProgram(
		@Param("timelineId", ParseUUIDPipe) _timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Body() dto: CreateProgramDto,
	) {
		return this.timelinesService.createProgramInSession(sessionId, {
			name: dto.name,
			routineId: dto.routineId,
			instructorId: dto.instructorId,
			capacity: dto.capacity,
			level: dto.level ?? null,
		});
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
		description: "프로그램 정보를 수정합니다. 루틴 변경 시 세션 내 중복 여부를 확인합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({ name: "programId", description: "프로그램 ID (UUID)", type: String })
	@ApiBody({ type: UpdateProgramDto, description: "수정할 프로그램 정보" })
	@ApiErrors(400, 401, 404, 409, 500)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	@ResponseMessage("common.program.update.success")
	async updateProgram(
		@Param("timelineId", ParseUUIDPipe) _timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
		@Body() dto: UpdateProgramDto,
	) {
		return this.timelinesService.updateProgramInSession(sessionId, programId, {
			name: dto.name,
			routineId: dto.routineId,
			instructorId: dto.instructorId,
			capacity: dto.capacity,
			level: dto.level,
		});
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
	@ApiParam({ name: "timelineId", description: "타임라인 ID (UUID)", type: String })
	@ApiParam({ name: "sessionId", description: "세션 ID (UUID)", type: String })
	@ApiParam({ name: "programId", description: "프로그램 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ResponseMessage("common.program.delete.success")
	async deleteProgram(
		@Param("timelineId", ParseUUIDPipe) _timelineId: string,
		@Param("sessionId", ParseUUIDPipe) sessionId: string,
		@Param("programId", ParseUUIDPipe) programId: string,
	): Promise<void> {
		await this.timelinesService.deleteProgramFromSession(sessionId, programId);
	}
}
