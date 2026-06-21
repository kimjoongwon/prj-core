import { RolesGuard } from "@cocrepo/be-common";
import {
	CreateTemplateCommand,
	DeleteTemplateCommand,
	GetTemplateByIdQuery,
	GetTemplatesQuery,
	PreviewTemplateQuery,
	SendTestTemplateCommand,
	ToggleTemplateStatusCommand,
	UpdateTemplateCommand,
} from "@cocrepo/command";
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
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TEMPLATES")
@Controller()
export class TemplatesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getTemplates",
		summary: "템플릿 목록 조회",
		description:
			"템플릿 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다. System Space 전용 API입니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(TemplateDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("템플릿 목록 조회 성공")
	async getTemplates(@Query() query: QueryTemplateDto) {
		return this.queryBus.execute(new GetTemplatesQuery(query));
	}

	@Get(":templateId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 조회 성공")
	async getTemplate(@Param("templateId", ParseUUIDPipe) templateId: string) {
		return this.queryBus.execute(new GetTemplateByIdQuery(templateId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 생성 성공")
	async createTemplate(@Body() dto: CreateTemplateDto) {
		return this.commandBus.execute(new CreateTemplateCommand(dto));
	}

	@Patch(":templateId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 수정 성공")
	async updateTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: UpdateTemplateDto,
	) {
		return this.commandBus.execute(new UpdateTemplateCommand(templateId, dto));
	}

	@Delete(":templateId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 삭제 성공")
	async deleteTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
	): Promise<void> {
		await this.commandBus.execute(new DeleteTemplateCommand(templateId));
	}

	@Patch(":templateId/toggle-status")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 상태 변경 성공")
	async toggleTemplateStatus(
		@Param("templateId", ParseUUIDPipe) templateId: string,
	) {
		return this.commandBus.execute(new ToggleTemplateStatusCommand(templateId));
	}

	@Post(":templateId/preview")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("템플릿 미리보기 성공")
	async previewTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: PreviewTemplateDto,
	) {
		return this.queryBus.execute(new PreviewTemplateQuery(templateId, dto));
	}

	@Post(":templateId/send-test")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("테스트 발송 성공")
	async sendTestTemplate(
		@Param("templateId", ParseUUIDPipe) templateId: string,
		@Body() dto: SendTestTemplateDto,
	) {
		return this.commandBus.execute(
			new SendTestTemplateCommand(templateId, dto),
		);
	}
}
