import { RolesGuard } from "@cocrepo/be-common";
import {
	ArchiveServiceDocumentCommand,
	CreateServiceDocumentCommand,
	DeleteServiceDocumentCommand,
	GetServiceDocumentsQuery,
	PublishServiceDocumentCommand,
	UpdateServiceDocumentCommand,
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
	CreateServiceDocumentDto,
	QueryServiceDocumentDto,
	ServiceDocumentDto,
	UpdateServiceDocumentDto,
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

@ApiTags("SERVICE_DOCUMENTS")
@Controller()
export class ServiceDocumentsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getServiceDocuments",
		summary: "서비스 문서 목록 조회",
		description:
			"약관, 개인정보처리방침, 마케팅 동의 등 서비스 문서 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(ServiceDocumentDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("서비스 문서 목록 조회 성공")
	getServiceDocuments(@Query() query: QueryServiceDocumentDto) {
		return this.queryBus.execute(new GetServiceDocumentsQuery(query));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createServiceDocument",
		summary: "서비스 문서 등록",
		description: "새 서비스 문서 버전을 DRAFT 상태로 등록합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateServiceDocumentDto,
		description: "등록할 서비스 문서 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(ServiceDocumentDto, HttpStatus.CREATED)
	@ResponseMessage("서비스 문서 생성 성공")
	createServiceDocument(@Body() dto: CreateServiceDocumentDto) {
		return this.commandBus.execute(new CreateServiceDocumentCommand(dto));
	}

	@Patch(":serviceDocumentId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateServiceDocument",
		summary: "서비스 문서 수정",
		description:
			"DRAFT 상태의 서비스 문서를 수정합니다. 게시된 문서는 새 버전으로 등록해야 합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "serviceDocumentId",
		description: "서비스 문서 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateServiceDocumentDto,
		description: "수정할 서비스 문서 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(ServiceDocumentDto, HttpStatus.OK)
	@ResponseMessage("서비스 문서 수정 성공")
	updateServiceDocument(
		@Param("serviceDocumentId", ParseUUIDPipe) serviceDocumentId: string,
		@Body() dto: UpdateServiceDocumentDto,
	) {
		return this.commandBus.execute(
			new UpdateServiceDocumentCommand(serviceDocumentId, dto),
		);
	}

	@Patch(":serviceDocumentId/publish")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "publishServiceDocument",
		summary: "서비스 문서 게시",
		description:
			"서비스 문서를 게시하고 같은 종류/플랫폼/로케일의 기존 게시 문서는 보관합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "serviceDocumentId",
		description: "서비스 문서 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(ServiceDocumentDto, HttpStatus.OK)
	@ResponseMessage("서비스 문서 게시 성공")
	publishServiceDocument(
		@Param("serviceDocumentId", ParseUUIDPipe) serviceDocumentId: string,
	) {
		return this.commandBus.execute(
			new PublishServiceDocumentCommand(serviceDocumentId),
		);
	}

	@Patch(":serviceDocumentId/archive")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "archiveServiceDocument",
		summary: "서비스 문서 보관",
		description: "서비스 문서를 ARCHIVED 상태로 전환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "serviceDocumentId",
		description: "서비스 문서 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(ServiceDocumentDto, HttpStatus.OK)
	@ResponseMessage("서비스 문서 보관 성공")
	archiveServiceDocument(
		@Param("serviceDocumentId", ParseUUIDPipe) serviceDocumentId: string,
	) {
		return this.commandBus.execute(
			new ArchiveServiceDocumentCommand(serviceDocumentId),
		);
	}

	@Delete(":serviceDocumentId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteServiceDocument",
		summary: "서비스 문서 삭제",
		description: "서비스 문서를 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "serviceDocumentId",
		description: "서비스 문서 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("서비스 문서 삭제 성공")
	async deleteServiceDocument(
		@Param("serviceDocumentId", ParseUUIDPipe) serviceDocumentId: string,
	): Promise<void> {
		await this.commandBus.execute(
			new DeleteServiceDocumentCommand(serviceDocumentId),
		);
	}
}
