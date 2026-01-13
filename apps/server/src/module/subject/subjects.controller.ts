import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SubjectDto } from "@cocrepo/dto";
import { SubjectsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
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
	async getAll(@Query("group") group?: string, @Query("type") _type?: string) {
		const subjects = group
			? await this.subjectsService.getSubjectsByGroup(group)
			: await this.subjectsService.getSubjects();

		return subjects.map((subject) => plainToInstance(SubjectDto, subject));
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		operationId: "getSubjectById",
		summary: "Subject 상세 조회",
		description: "ID로 Subject를 조회합니다.",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	@ResponseMessage("Subject 조회 성공")
	async getById(@Param("id") id: string) {
		const subject = await this.subjectsService.getSubjectById(id);
		return plainToInstance(SubjectDto, subject);
	}
}
