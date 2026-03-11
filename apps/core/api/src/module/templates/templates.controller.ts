import { TemplatesApplicationService } from "@cocrepo/app";
import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateTemplateDto,
	PreviewTemplateDto,
	QueryTemplateDto,
	SendTestTemplateDto,
	TemplateDto,
	UpdateTemplateDto,
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
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TEMPLATES")
@Controller()
export class TemplatesController {
	constructor(
		private readonly templatesApplicationService: TemplatesApplicationService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getTemplates",
		summary: "템플릿 목록 조회",
		description:
			"템플릿 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("template.list.success")
	async getTemplates(@Query() query: QueryTemplateDto) {
		return this.templatesApplicationService.getTemplates(query);
	}

	@Get(":templateId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getTemplate",
		summary: "템플릿 상세 조회",
		description:
			"특정 템플릿의 상세 정보를 조회합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.OK)
	@ResponseMessage("template.read.success")
	async getTemplate(@Param("templateId", ParseUUIDPipe) templateId: string) {
		return this.templatesApplicationService.getTemplate(templateId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createTemplate",
		summary: "템플릿 등록",
		description: "새로운 템플릿을 등록합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateTemplateDto,
		description: "등록할 템플릿 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.CREATED)
	@ResponseMessage("template.create.success")
	async createTemplate(@Body() dto: CreateTemplateDto) {
		return this.templatesApplicationService.createTemplate(dto);
	}

	@Patch(":templateId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateTemplate",
		summary: "템플릿 수정",
		description:
			"템플릿 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateTemplateDto,
		description: "수정할 템플릿 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.OK)
	@ResponseMessage("template.update.success")
	async updateTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: UpdateTemplateDto,
	) {
		return this.templatesApplicationService.updateTemplate(templateId, dto);
	}

	@Delete(":templateId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteTemplate",
		summary: "템플릿 삭제",
		description: "템플릿을 삭제합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("template.delete.success")
	async deleteTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
	): Promise<void> {
		await this.templatesApplicationService.deleteTemplate(templateId);
	}

	@Patch(":templateId/toggle-status")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "toggleTemplateStatus",
		summary: "템플릿 활성/비활성 토글",
		description:
			"템플릿의 활성/비활성 상태를 전환합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.OK)
	@ResponseMessage("template.toggle-status.success")
	async toggleTemplateStatus(
		@Param("templateId", ParseUUIDPipe) templateId: string,
	) {
		return this.templatesApplicationService.toggleTemplateStatus(templateId);
	}

	@Post(":templateId/preview")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "previewTemplate",
		summary: "템플릿 미리보기",
		description:
			"템플릿에 변수를 대입하여 미리보기 결과를 반환합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: PreviewTemplateDto,
		description: "미리보기 변수 데이터",
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("template.preview.success")
	async previewTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: PreviewTemplateDto,
	) {
		return this.templatesApplicationService.previewTemplate(templateId, dto);
	}

	@Post(":templateId/send-test")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "sendTestTemplate",
		summary: "템플릿 발송 테스트",
		description:
			"템플릿을 테스트 수신자에게 발송합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "templateId",
		description: "템플릿 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: SendTestTemplateDto,
		description: "발송 테스트 정보 (수신자, 변수 등)",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("template.send-test.success")
	async sendTestTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: SendTestTemplateDto,
	) {
		return this.templatesApplicationService.sendTestTemplate(templateId, dto);
	}
}
