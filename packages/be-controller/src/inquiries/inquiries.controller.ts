import {
	AssignInquiryCommand,
	CreateInquiryCommand,
	DeleteInquiryCommand,
	GetInquiryByIdQuery,
	GetInquiryCreateFormBootstrapQuery,
	GetInquiryMessagesQuery,
	GetInquiryParticipantsQuery,
	GetInquiryStatsQuery,
	GetInquiryUpdateFormBootstrapQuery,
	ListInquiriesQuery,
	UpdateInquiryCommand,
	UpdateInquiryPriorityCommand,
	UpdateInquiryStatusCommand,
} from "@cocrepo/command";
import { USER_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateInquiryDto,
	InquiryCreateUpdateFormBootstrapDto,
	InquiryDetailDto,
	InquiryDto,
	InquiryFormFieldMetaDto,
	InquiryFormOptionItemDto,
	InquiryFormUiPathsDto,
	InquiryMessageDto,
	InquiryMessagePaginationMetaDto,
	InquiryPaginationMetaDto,
	InquiryStatsDto,
	QueryInquiryDto,
	UpdateInquiryDto,
} from "@cocrepo/dto";
import { Inquiry, InquiryParticipant } from "@cocrepo/entity";
import type { InquiryPriority, InquiryStatus } from "@cocrepo/prisma";
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
	UnauthorizedException,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
	ApiBody,
	ApiExtraModels,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";

@ApiTags("INQUIRIES")
@ApiExtraModels(
	InquiryFormOptionItemDto,
	InquiryFormUiPathsDto,
	InquiryFormFieldMetaDto,
)
@Controller()
export class InquiriesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getInquiries",
		summary: "문의 목록 조회",
		description:
			"현재 Space 내의 문의 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.OK, {
		isArray: true,
		metaDto: InquiryPaginationMetaDto,
	})
	@ResponseMessage("문의 목록 조회 성공")
	async getInquiries(@Query() query: QueryInquiryDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(new ListInquiriesQuery(query));
	}

	@Get("stats")
	@ApiOperation({
		operationId: "getInquiryStats",
		summary: "문의 통계 조회",
		description:
			"현재 Space 내의 문의 통계를 조회합니다. 상태별, 카테고리별 통계와 SLA 초과 현황을 포함합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(InquiryStatsDto, HttpStatus.OK)
	@ResponseMessage("문의 통계 조회 성공")
	async getStats() {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const stats = await this.queryBus.execute(new GetInquiryStatsQuery());
		return stats;
	}

	@Get("form/create")
	@ApiOperation({
		operationId: "getCreateInquiryForm",
		summary: "문의 생성 폼 bootstrap 조회",
		description:
			"문의 생성 화면의 초기 렌더링에 필요한 defaultObject/options/ui/fieldMeta를 반환합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(InquiryCreateUpdateFormBootstrapDto, HttpStatus.OK)
	@ResponseMessage("문의 생성 폼 bootstrap 조회 성공")
	async getCreateInquiryForm(): Promise<InquiryCreateUpdateFormBootstrapDto> {
		return this.queryBus.execute(new GetInquiryCreateFormBootstrapQuery());
	}

	@Get(":inquiryId/form/update")
	@ApiOperation({
		operationId: "getUpdateInquiryForm",
		summary: "문의 수정 폼 bootstrap 조회",
		description:
			"문의 수정 화면의 초기 렌더링에 필요한 defaultObject/options/ui/fieldMeta를 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryCreateUpdateFormBootstrapDto, HttpStatus.OK)
	@ResponseMessage("문의 수정 폼 bootstrap 조회 성공")
	async getUpdateInquiryForm(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
	): Promise<InquiryCreateUpdateFormBootstrapDto> {
		return this.queryBus.execute(
			new GetInquiryUpdateFormBootstrapQuery(inquiryId),
		);
	}

	@Get(":inquiryId")
	@ApiOperation({
		operationId: "getInquiryById",
		summary: "문의 상세 조회",
		description:
			"특정 문의의 상세 정보를 조회합니다. 스레드, 메시지, 참여자 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryDetailDto, HttpStatus.OK)
	@ResponseMessage("문의 상세 조회 성공")
	async getInquiryById(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
	): Promise<Inquiry> {
		return this.queryBus.execute(new GetInquiryByIdQuery(inquiryId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createInquiry",
		summary: "문의 등록",
		description: "새로운 문의를 등록합니다. 문의 번호는 자동 생성됩니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateInquiryDto,
		description: "문의 등록 정보",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.CREATED)
	@ResponseMessage("문의 등록 성공")
	async createInquiry(@Body() dto: CreateInquiryDto): Promise<Inquiry> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const actorUserId = this.authContext.user?.id;
		if (!actorUserId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		return this.commandBus.execute(
			new CreateInquiryCommand(dto, spaceId, actorUserId),
		);
	}

	@Patch(":inquiryId")
	@ApiOperation({
		operationId: "updateInquiry",
		summary: "문의 수정",
		description: "문의 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateInquiryDto,
		description: "문의 수정 정보",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.OK)
	@ResponseMessage("문의 수정 성공")
	async updateInquiry(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() dto: UpdateInquiryDto,
	): Promise<Inquiry> {
		return this.commandBus.execute(new UpdateInquiryCommand(inquiryId, dto));
	}

	@Delete(":inquiryId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteInquiry",
		summary: "문의 삭제",
		description: "문의를 삭제합니다 (Soft Delete).",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ResponseMessage("문의 삭제 성공")
	async deleteInquiry(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
	): Promise<void> {
		await this.commandBus.execute(new DeleteInquiryCommand(inquiryId));
	}

	@Patch(":inquiryId/assign")
	@ApiOperation({
		operationId: "assignInquiry",
		summary: "담당자 배정",
		description:
			"문의에 담당자를 배정합니다. NEW 상태면 OPEN으로 자동 변경됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				assigneeId: {
					type: "string",
					format: "uuid",
					description: "담당자 ID",
				},
			},
			required: ["assigneeId"],
		},
	})
	@ApiErrors(
		{ status: 400, message: "종료된 문의는 담당자를 배정할 수 없습니다" },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.OK)
	@ResponseMessage("담당자 배정 성공")
	async assignInquiry(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() body: { assigneeId: string },
	): Promise<Inquiry> {
		return this.commandBus.execute(
			new AssignInquiryCommand(inquiryId, body.assigneeId),
		);
	}

	@Patch(":inquiryId/status")
	@ApiOperation({
		operationId: "updateInquiryStatus",
		summary: "상태 변경",
		description:
			"문의 상태를 변경합니다. 상태 전이 규칙에 따라 유효한 상태로만 변경 가능합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: [
						"NEW",
						"OPEN",
						"IN_PROGRESS",
						"WAITING_CUSTOMER",
						"RESOLVED",
						"CLOSED",
						"ESCALATED",
					],
					description: "변경할 상태",
				},
			},
			required: ["status"],
		},
	})
	@ApiErrors(
		{ status: 400, message: "유효하지 않은 상태 전이입니다" },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.OK)
	@ResponseMessage("상태 변경 성공")
	async updateInquiryStatus(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() body: { status: InquiryStatus },
	): Promise<Inquiry> {
		return this.commandBus.execute(
			new UpdateInquiryStatusCommand(inquiryId, body.status),
		);
	}

	@Patch(":inquiryId/priority")
	@ApiOperation({
		operationId: "updateInquiryPriority",
		summary: "우선순위 변경",
		description: "문의의 우선순위를 변경합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				priority: {
					type: "string",
					enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
					description: "변경할 우선순위",
				},
			},
			required: ["priority"],
		},
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryDto, HttpStatus.OK)
	@ResponseMessage("우선순위 변경 성공")
	async updateInquiryPriority(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() body: { priority: InquiryPriority },
	): Promise<Inquiry> {
		return this.commandBus.execute(
			new UpdateInquiryPriorityCommand(inquiryId, body.priority),
		);
	}

	@Get(":inquiryId/messages")
	@ApiOperation({
		operationId: "getInquiryMessages",
		summary: "메시지 목록 조회",
		description: "문의의 메시지 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryMessageDto, HttpStatus.OK, {
		isArray: true,
		metaDto: InquiryMessagePaginationMetaDto,
	})
	@ResponseMessage("메시지 목록 조회 성공")
	async getMessages(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Query() query: { skip?: number; take?: number },
	) {
		return this.queryBus.execute(
			new GetInquiryMessagesQuery({
				inquiryId,
				...query,
			}),
		);
	}

	@Get(":inquiryId/participants")
	@ApiOperation({
		operationId: "getInquiryParticipants",
		summary: "참여자 목록 조회",
		description: "문의의 참여자 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryParticipant, HttpStatus.OK, { isArray: true })
	@ResponseMessage("참여자 목록 조회 성공")
	async getParticipants(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
	): Promise<InquiryParticipant[]> {
		return this.queryBus.execute(new GetInquiryParticipantsQuery(inquiryId));
	}
}
