import {
	GetSubjectByIdQuery,
	GetSubjectFieldsQuery,
	GetSubjectsQuery,
} from "@cocrepo/command";
import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SubjectDto, SubjectFieldDto } from "@cocrepo/dto";
import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(private readonly queryBus: QueryBus) {}

	@Public()
	@Get()
	@ApiOperation({
		operationId: "getSubjects",
		summary: "Subject 목록 조회",
		description: "모든 Subject 목록을 조회합니다.",
	})
	@ApiQuery({
		name: "group",
		required: false,
		description: "그룹별 필터링",
	})
	@ApiQuery({
		name: "type",
		required: false,
		description: "타입별 필터링 (entity, menu, feature, ui)",
	})
	@ApiErrors(500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("대상 목록 조회 성공")
	async getSubjects(
		@Query("group") group?: string,
		@Query("type") _type?: string,
	) {
		return this.queryBus.execute(new GetSubjectsQuery(group));
	}

	@Public()
	@Get(":id/fields")
	@ApiOperation({
		operationId: "getSubjectFields",
		summary: "Subject 필드 목록 조회",
		description:
			"Subject의 필드 목록을 조회합니다. entity:xxx Subject의 경우 DMMF에서 필드 정보를 가져옵니다.",
	})
	@ApiParam({
		name: "id",
		description: "Subject ID (UUID)",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(SubjectFieldDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("대상 필드 목록 조회 성공")
	async getSubjectFields(@Param("id") id: string) {
		return this.queryBus.execute(new GetSubjectFieldsQuery(id));
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		operationId: "getSubjectById",
		summary: "Subject 상세 조회",
		description: "ID로 Subject를 조회합니다.",
	})
	@ApiParam({
		name: "id",
		description: "Subject ID (UUID)",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	@ResponseMessage("대상 조회 성공")
	async getSubjectById(@Param("id") id: string) {
		return this.queryBus.execute(new GetSubjectByIdQuery(id));
	}
}
