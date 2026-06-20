import {
	GetCourseOfferingsQuery,
	GetCoursePassesQuery,
	GetCoursesQuery,
	GetEnrollmentsQuery,
} from "@cocrepo/command";
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
	EnrollmentDto,
	QueryCourseDto,
	QueryCourseOfferingDto,
	QueryCoursePassDto,
	QueryEnrollmentDto,
} from "@cocrepo/dto";
import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("COURSES")
@Controller()
export class CoursesController {
	constructor(private readonly queryBus: QueryBus) {}

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
		return this.queryBus.execute(new GetCoursesQuery(query));
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
		return this.queryBus.execute(new GetCourseOfferingsQuery(query));
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
		return this.queryBus.execute(new GetEnrollmentsQuery(query));
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
		return this.queryBus.execute(new GetCoursePassesQuery(query));
	}
}
