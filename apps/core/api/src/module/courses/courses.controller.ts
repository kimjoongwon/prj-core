import { CourseApplicationService } from "@cocrepo/app";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CourseDto,
	CourseOfferingDto,
	CoursePassDto,
	CreateCourseDto,
	CreateCourseOfferingDto,
	CreateEnrollmentDto,
	EnrollmentDto,
	QueryCourseDto,
	QueryCourseOfferingDto,
	QueryCoursePassDto,
	QueryEnrollmentDto,
	UpdateCourseDto,
	UpdateCourseOfferingDto,
	UpdateCoursePassDto,
	UpdateEnrollmentDto,
} from "@cocrepo/dto";
import { CourseFacade } from "@cocrepo/facade";
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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("COURSES")
@Controller()
export class CoursesController {
	constructor(
		private readonly courseFacade: CourseFacade,
		private readonly courseApplicationService: CourseApplicationService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCourses",
		summary: "코스 목록 조회",
		description:
			"현재 Space 기준으로 코스 목록을 조회합니다. 검색, 상태 필터, 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(CourseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("코스 목록 조회 성공")
	getCourses(@Query() query: QueryCourseDto) {
		return this.courseFacade.getCourses(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createCourse",
		summary: "코스 생성",
		description: "관리자가 운영할 코스를 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateCourseDto, description: "생성할 코스 정보" })
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(CourseDto, HttpStatus.CREATED)
	@ResponseMessage("코스 생성 성공")
	createCourse(@Body() dto: CreateCourseDto) {
		return this.courseApplicationService.createCourse(dto);
	}

	@Get("offerings")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCourseOfferings",
		summary: "코스 개설 목록 조회",
		description:
			"현재 Space 기준으로 실제 개설된 과정/반/기수 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(CourseOfferingDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("코스 개설 목록 조회 성공")
	getCourseOfferings(@Query() query: QueryCourseOfferingDto) {
		return this.courseFacade.getCourseOfferings(query);
	}

	@Post("offerings")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createCourseOffering",
		summary: "코스 개설 생성",
		description: "코스의 실제 운영 반/기수를 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateCourseOfferingDto,
		description: "생성할 코스 개설 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CourseOfferingDto, HttpStatus.CREATED)
	@ResponseMessage("코스 개설 생성 성공")
	createCourseOffering(@Body() dto: CreateCourseOfferingDto) {
		return this.courseApplicationService.createCourseOffering(dto);
	}

	@Get("offerings/:courseOfferingId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCourseOfferingById",
		summary: "코스 개설 상세 조회",
		description: "특정 코스 개설의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseOfferingId",
		description: "코스 개설 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(CourseOfferingDto, HttpStatus.OK)
	@ResponseMessage("코스 개설 조회 성공")
	getCourseOfferingById(
		@Param("courseOfferingId", ParseUUIDPipe) courseOfferingId: string,
	) {
		return this.courseFacade.getCourseOfferingById(courseOfferingId);
	}

	@Patch("offerings/:courseOfferingId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateCourseOffering",
		summary: "코스 개설 수정",
		description: "코스 개설 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseOfferingId",
		description: "코스 개설 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateCourseOfferingDto,
		description: "수정할 코스 개설 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CourseOfferingDto, HttpStatus.OK)
	@ResponseMessage("코스 개설 수정 성공")
	updateCourseOffering(
		@Param("courseOfferingId", ParseUUIDPipe) courseOfferingId: string,
		@Body() dto: UpdateCourseOfferingDto,
	) {
		return this.courseApplicationService.updateCourseOffering(
			courseOfferingId,
			dto,
		);
	}

	@Delete("offerings/:courseOfferingId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteCourseOffering",
		summary: "코스 개설 삭제",
		description: "코스 개설을 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseOfferingId",
		description: "코스 개설 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("코스 개설 삭제 성공")
	async deleteCourseOffering(
		@Param("courseOfferingId", ParseUUIDPipe) courseOfferingId: string,
	): Promise<void> {
		await this.courseApplicationService.deleteCourseOffering(courseOfferingId);
	}

	@Get("enrollments")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getEnrollments",
		summary: "수강 등록 목록 조회",
		description: "결제 후 생성되는 수강 등록 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(EnrollmentDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("수강 등록 목록 조회 성공")
	getEnrollments(@Query() query: QueryEnrollmentDto) {
		return this.courseFacade.getEnrollments(query);
	}

	@Post("enrollments")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createEnrollment",
		summary: "수강 등록 생성",
		description: "결제 상태를 포함한 수강 등록을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateEnrollmentDto, description: "생성할 수강 등록 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(EnrollmentDto, HttpStatus.CREATED)
	@ResponseMessage("수강 등록 생성 성공")
	createEnrollment(@Body() dto: CreateEnrollmentDto) {
		return this.courseApplicationService.createEnrollment(dto);
	}

	@Get("enrollments/:enrollmentId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getEnrollmentById",
		summary: "수강 등록 상세 조회",
		description: "특정 수강 등록의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "enrollmentId",
		description: "수강 등록 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(EnrollmentDto, HttpStatus.OK)
	@ResponseMessage("수강 등록 조회 성공")
	getEnrollmentById(
		@Param("enrollmentId", ParseUUIDPipe) enrollmentId: string,
	) {
		return this.courseFacade.getEnrollmentById(enrollmentId);
	}

	@Patch("enrollments/:enrollmentId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateEnrollment",
		summary: "수강 등록 수정",
		description: "수강 등록 상태와 결제 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "enrollmentId",
		description: "수강 등록 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdateEnrollmentDto, description: "수정할 수강 등록 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(EnrollmentDto, HttpStatus.OK)
	@ResponseMessage("수강 등록 수정 성공")
	updateEnrollment(
		@Param("enrollmentId", ParseUUIDPipe) enrollmentId: string,
		@Body() dto: UpdateEnrollmentDto,
	) {
		return this.courseApplicationService.updateEnrollment(enrollmentId, dto);
	}

	@Delete("enrollments/:enrollmentId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteEnrollment",
		summary: "수강 등록 삭제",
		description: "수강 등록을 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "enrollmentId",
		description: "수강 등록 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("수강 등록 삭제 성공")
	async deleteEnrollment(
		@Param("enrollmentId", ParseUUIDPipe) enrollmentId: string,
	): Promise<void> {
		await this.courseApplicationService.deleteEnrollment(enrollmentId);
	}

	@Get("passes")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCoursePasses",
		summary: "수강권 목록 조회",
		description: "결제 성공 후 활성화되는 CoursePass 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(CoursePassDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("수강권 목록 조회 성공")
	getCoursePasses(@Query() query: QueryCoursePassDto) {
		return this.courseFacade.getCoursePasses(query);
	}

	@Get("passes/:coursePassId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCoursePassById",
		summary: "수강권 상세 조회",
		description: "특정 수강권의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "coursePassId",
		description: "수강권 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(CoursePassDto, HttpStatus.OK)
	@ResponseMessage("수강권 조회 성공")
	getCoursePassById(
		@Param("coursePassId", ParseUUIDPipe) coursePassId: string,
	) {
		return this.courseFacade.getCoursePassById(coursePassId);
	}

	@Patch("passes/:coursePassId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateCoursePass",
		summary: "수강권 수정",
		description: "수강권 상태와 예약 가능 횟수를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "coursePassId",
		description: "수강권 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdateCoursePassDto, description: "수정할 수강권 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CoursePassDto, HttpStatus.OK)
	@ResponseMessage("수강권 수정 성공")
	updateCoursePass(
		@Param("coursePassId", ParseUUIDPipe) coursePassId: string,
		@Body() dto: UpdateCoursePassDto,
	) {
		return this.courseApplicationService.updateCoursePass(coursePassId, dto);
	}

	@Get(":courseId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getCourseById",
		summary: "코스 상세 조회",
		description: "특정 코스의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseId",
		description: "코스 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(CourseDto, HttpStatus.OK)
	@ResponseMessage("코스 조회 성공")
	getCourseById(@Param("courseId", ParseUUIDPipe) courseId: string) {
		return this.courseFacade.getCourseById(courseId);
	}

	@Patch(":courseId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateCourse",
		summary: "코스 수정",
		description: "코스 기본 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseId",
		description: "코스 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdateCourseDto, description: "수정할 코스 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(CourseDto, HttpStatus.OK)
	@ResponseMessage("코스 수정 성공")
	updateCourse(
		@Param("courseId", ParseUUIDPipe) courseId: string,
		@Body() dto: UpdateCourseDto,
	) {
		return this.courseApplicationService.updateCourse(courseId, dto);
	}

	@Delete(":courseId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteCourse",
		summary: "코스 삭제",
		description: "코스를 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "courseId",
		description: "코스 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("코스 삭제 성공")
	async deleteCourse(
		@Param("courseId", ParseUUIDPipe) courseId: string,
	): Promise<void> {
		await this.courseApplicationService.deleteCourse(courseId);
	}
}
