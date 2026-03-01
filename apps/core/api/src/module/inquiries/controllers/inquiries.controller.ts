import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateInquiryDto,
	CreateInquiryMessageDto,
	FillInquiryFormRequestDto,
	FillInquiryFormResponseDto,
	InquiryDetailDto,
	InquiryDto,
	InquiryCreateUpdateFormBootstrapDto,
	InquiryMessageDto,
	InquiryMessagePaginationMetaDto,
	InquiryPaginationMetaDto,
	InquiryStatsDto,
	QueryInquiryDto,
	UpdateInquiryDto,
} from "@cocrepo/dto";
import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import type {
	InquiryParticipantRole,
	InquiryPriority,
	InquiryStatus,
} from "@cocrepo/prisma";
import {
	InquiriesService,
	InquiryMessagesService,
	InquiryParticipantsService,
} from "@cocrepo/service";
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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

@ApiTags("INQUIRIES")
@Controller()
export class InquiriesController {
	constructor(
		private readonly inquiriesService: InquiriesService,
		private readonly inquiryMessagesService: InquiryMessagesService,
		private readonly inquiryParticipantsService: InquiryParticipantsService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}

	/**
	 * 현재 로그인한 사용자를 가져옵니다.
	 */
	private getCurrentUser(): Inquiry {
		const user = this.cls.get<Inquiry>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}
		return user;
	}

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
		const where = query.toPrismaWhere({ spaceId: this.getSpaceId() });
		const orderBy = query.toPrismaOrderBy();

		const { items, totalCount } = await this.inquiriesService.list({
			where,
			orderBy,
			skip: query.skip,
			take: query.take,
		});

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return wrapResponse(items, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		});
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
		const spaceId = this.getSpaceId();
		const stats = await this.inquiriesService.getStats(spaceId);
		return stats;
	}

	@Get("form/create")
	@ApiOperation({
		operationId: "getCreateInquiryForm",
		summary: "문의 생성 폼 bootstrap 조회",
		description:
			"문의 생성 화면의 초기 렌더링에 필요한 defaultObject/options/ui/fieldMeta/aiSchemas를 반환합니다.",
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
		return this.inquiriesService.getCreateFormBootstrap();
	}

	@Get(":inquiryId/form/update")
	@ApiOperation({
		operationId: "getUpdateInquiryForm",
		summary: "문의 수정 폼 bootstrap 조회",
		description:
			"문의 수정 화면의 초기 렌더링에 필요한 defaultObject/options/ui/fieldMeta/aiSchemas를 반환합니다.",
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
		return this.inquiriesService.getUpdateFormBootstrap(inquiryId);
	}

	@Post("form/ai-fill")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "fillInquiryFormWithAi",
		summary: "문의 폼 AI 채움",
		description:
			"선택한 aiSchemas/path와 현재 폼 상태를 기반으로 서버에서 patch를 생성하여 반환합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: FillInquiryFormRequestDto,
		description: "문의 폼 AI 채움 요청",
	})
	@ApiErrors(
		{ status: 400, message: "유효하지 않은 AI 스키마 키입니다" },
		{ status: 400, message: "AI 채움이 허용되지 않은 path가 포함되어 있습니다" },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(FillInquiryFormResponseDto, HttpStatus.OK)
	@ResponseMessage("문의 폼 AI 채움 성공")
	async fillInquiryFormWithAi(
		@Body() dto: FillInquiryFormRequestDto,
	): Promise<FillInquiryFormResponseDto> {
		return this.inquiriesService.fillFormWithAi(dto);
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
		return this.inquiriesService.findByIdWithDetails(inquiryId);
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
		const spaceId = this.getSpaceId();

		return this.inquiriesService.create({
			...dto.toEntity(),
			spaceId,
		} as Parameters<typeof this.inquiriesService.create>[0]);
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
		return this.inquiriesService.update(inquiryId, dto);
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
		await this.inquiriesService.softDelete(inquiryId);
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
		return this.inquiriesService.assignTo(inquiryId, body.assigneeId);
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
		return this.inquiriesService.updateStatus(inquiryId, body.status);
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
		return this.inquiriesService.updatePriority(inquiryId, body.priority);
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
		// 문의 존재 확인
		await this.inquiriesService.findById(inquiryId);

		const { items, totalCount } =
			await this.inquiryMessagesService.listByInquiry({
				inquiryId,
				skip: query.skip,
				take: query.take,
			});

		const skip = query.skip ?? 0;
		const take = query.take ?? 50;

		return wrapResponse(items, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		});
	}

	@Post(":inquiryId/messages")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "sendInquiryMessage",
		summary: "메시지 전송",
		description: "문의에 메시지를 전송합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "inquiryId",
		description: "문의 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: CreateInquiryMessageDto,
		description: "메시지 정보",
	})
	@ApiErrors(
		{ status: 400, message: "이미 처리된 메시지입니다 (중복 clientMessageId)" },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryMessageDto, HttpStatus.CREATED)
	@ResponseMessage("메시지 전송 성공")
	async sendMessage(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() dto: CreateInquiryMessageDto,
	): Promise<InquiryMessage> {
		const currentUser = this.getCurrentUser();

		// 문의 존재 확인 및 스레드 ID 확보
		const inquiry = await this.inquiriesService.findById(inquiryId);

		// 기본 스레드 ID (첫 번째 스레드 사용 또는 dto의 threadId)
		const threadId = dto.threadId ?? inquiry.threads?.[0]?.id ?? "";

		return this.inquiryMessagesService.create({
			inquiryId,
			threadId,
			senderId: currentUser.id,
			content: dto.content,
			contentType: dto.contentType ?? "TEXT",
			senderType: dto.senderType ?? "USER",
			clientMessageId: dto.clientMessageId,
		});
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
		// 문의 존재 확인
		await this.inquiriesService.findById(inquiryId);

		return this.inquiryParticipantsService.getByInquiry(inquiryId);
	}

	@Post(":inquiryId/participants/join")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "joinInquiry",
		summary: "문의 참여",
		description:
			"문의에 참여합니다. 이미 참여 중이면 온라인 상태로 변경됩니다.",
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
				threadId: {
					type: "string",
					format: "uuid",
					description: "스레드 ID (선택)",
				},
				role: {
					type: "string",
					enum: ["CUSTOMER", "AGENT", "SUPERVISOR", "VIEWER"],
					description: "참여자 역할 (기본값: VIEWER)",
				},
			},
		},
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "문의를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(InquiryParticipant, HttpStatus.OK)
	@ResponseMessage("문의 참여 성공")
	async joinInquiry(
		@Param("inquiryId", ParseUUIDPipe) inquiryId: string,
		@Body() body: { threadId?: string; role?: InquiryParticipantRole },
	): Promise<InquiryParticipant> {
		const currentUser = this.getCurrentUser();

		// 문의 존재 확인
		await this.inquiriesService.findById(inquiryId);

		return this.inquiryParticipantsService.join({
			inquiryId,
			userId: currentUser.id,
			threadId: body.threadId,
			role: body.role,
		});
	}

}
