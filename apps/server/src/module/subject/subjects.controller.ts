import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SubjectDto, SubjectFieldDto } from "@cocrepo/dto";
import { SubjectsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("SUBJECTS")
@Controller("subjects")
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) {}

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
	@ResponseMessage("Subject 목록 조회 성공")
	async getSubjects(@Query("group") group?: string, @Query("type") _type?: string) {
		const subjects = group
			? await this.subjectsService.getSubjectsByGroup(group)
			: await this.subjectsService.getSubjects();

		return subjects.map((subject) => plainToInstance(SubjectDto, subject));
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
	@ResponseMessage("Subject 필드 목록 조회 성공")
	async getSubjectFields(@Param("id") id: string) {
		// ID로 Subject를 먼저 조회하여 이름을 가져옴
		const subject = await this.subjectsService.getSubjectById(id);
		if (!subject) {
			return [];
		}

		const fields = await this.subjectsService.getSubjectFields(subject.name);
		return fields.map((field) => plainToInstance(SubjectFieldDto, field));
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
	@ResponseMessage("Subject 조회 성공")
	async getSubjectById(@Param("id") id: string) {
		const subject = await this.subjectsService.getSubjectById(id);
		return plainToInstance(SubjectDto, subject);
	}
}
