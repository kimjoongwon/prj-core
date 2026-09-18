import { ParseBigIntIdPipe, RolesGuard } from "@cocrepo/be-common";
import {
	GetSubjectByIdQuery,
	GetSubjectFieldsQuery,
	GetSubjectsQuery,
} from "@cocrepo/command";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import { SubjectDto, SubjectFieldDto } from "@cocrepo/dto";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getSubjects",
		summary: "Subject 목록 조회",
		description: "플랫폼 관리자용 Subject 목록을 조회합니다.",
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
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("대상 목록 조회 성공")
	async getSubjects(
		@Query("group") group?: string,
		@Query("type") _type?: string,
	) {
		return this.queryBus.execute(new GetSubjectsQuery(group));
	}

	@Get(":id/fields")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getSubjectFields",
		summary: "Subject 필드 목록 조회",
		description:
			"플랫폼 관리자용 Subject 필드 목록을 조회합니다. entity:xxx Subject의 경우 DMMF에서 필드 정보를 가져옵니다.",
	})
	@ApiParam({
		name: "id",
		description: "Subject ID (canonical decimal BIGINT string)",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(SubjectFieldDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("대상 필드 목록 조회 성공")
	async getSubjectFields(@Param("id", ParseBigIntIdPipe) id: bigint) {
		return this.queryBus.execute(new GetSubjectFieldsQuery(id));
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getSubjectById",
		summary: "Subject 상세 조회",
		description: "플랫폼 관리자용 Subject 상세 정보를 조회합니다.",
	})
	@ApiParam({
		name: "id",
		description: "Subject ID (canonical decimal BIGINT string)",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	@ResponseMessage("대상 조회 성공")
	async getSubjectById(@Param("id", ParseBigIntIdPipe) id: bigint) {
		return this.queryBus.execute(new GetSubjectByIdQuery(id));
	}
}
