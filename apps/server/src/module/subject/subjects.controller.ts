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
	async getAll(@Query("group") group?: string, @Query("type") type?: string) {
		let subjects;

		if (group) {
			subjects = await this.subjectsService.getByGroup(group);
		} else if (type) {
			switch (type) {
				case "entity":
					subjects = await this.subjectsService.getEntitySubjects();
					break;
				case "menu":
					subjects = await this.subjectsService.getMenuSubjects();
					break;
				case "feature":
					subjects = await this.subjectsService.getFeatureSubjects();
					break;
				case "ui":
					subjects = await this.subjectsService.getUiSubjects();
					break;
				default:
					subjects = await this.subjectsService.getAll();
			}
		} else {
			subjects = await this.subjectsService.getAll();
		}

		return subjects.map((subject) => plainToInstance(SubjectDto, subject));
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		summary: "Subject 상세 조회",
		description: "ID로 Subject를 조회합니다.",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	@ResponseMessage("Subject 조회 성공")
	async getById(@Param("id") id: string) {
		const subject = await this.subjectsService.getById(id);
		return plainToInstance(SubjectDto, subject);
	}
}
