import { USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	CreateTenantAccessRequestDto,
	QueryTenantAccessRequestDto,
	ReviewTenantAccessRequestDto,
	TenantAccessRequestCreateFormBootstrapDto,
	TenantAccessRequestDto,
	TenantAccessRequestFormFieldMetaDto,
	TenantAccessRequestFormOptionItemDto,
	TenantAccessRequestFormSchemaDto,
	TenantAccessRequestFormUiPathsDto,
	TenantAccessRequestPaginationMetaDto,
} from "@cocrepo/dto";
import { TenantAccessRequest } from "@cocrepo/entity";
import { TenantAccessRequestFacade } from "@cocrepo/facade";
import { AuthContext } from "@cocrepo/service";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import {
	ApiBody,
	ApiExtraModels,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";

@ApiTags("TENANT_ACCESS_REQUESTS")
@ApiExtraModels(
	TenantAccessRequestFormOptionItemDto,
	TenantAccessRequestFormUiPathsDto,
	TenantAccessRequestFormFieldMetaDto,
	TenantAccessRequestFormSchemaDto,
)
@SkipSpaceCheck()
@Controller()
export class TenantAccessRequestsController {
	constructor(
		private readonly tenantAccessRequestFacade: TenantAccessRequestFacade,
		private readonly authContext: AuthContext,
	) {}

	@Get("form/create")
	@ApiOperation({
		operationId: "getCreateTenantAccessRequestForm",
		summary: "테넌트 접근 신청 생성 폼 bootstrap 조회",
		description:
			"신청자가 Space와 희망 Role을 선택할 수 있도록 폼 초기값과 옵션을 반환합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: USER_ERRORS.USER_NOT_FOUND }, 500)
	@ApiResponseEntity(TenantAccessRequestCreateFormBootstrapDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 생성 폼 조회 성공")
	getCreateForm(): Promise<TenantAccessRequestCreateFormBootstrapDto> {
		this.authContext.assertAuthenticated();
		return this.tenantAccessRequestFacade.getCreateFormBootstrap();
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createTenantAccessRequest",
		summary: "테넌트 접근 신청 생성",
		description:
			"신청자가 특정 Space와 Role에 대한 접근 신청을 생성합니다. 같은 user+space의 PENDING 신청은 1개만 허용합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateTenantAccessRequestDto,
		description: "테넌트 접근 신청 생성 payload",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 404, message: "신청 대상 Space를 찾을 수 없습니다" },
		{ status: 404, message: "신청 대상 Role을 찾을 수 없습니다" },
		{ status: 409, message: "해당 Space에 처리 대기 중인 신청이 있습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.CREATED)
	@ResponseMessage("테넌트 접근 신청 생성 성공")
	create(
		@Body() dto: CreateTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		const requesterId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.create({ requesterId, dto });
	}

	@Get("my")
	@ApiOperation({
		operationId: "getMyTenantAccessRequests",
		summary: "내 테넌트 접근 신청 목록 조회",
		description: "현재 로그인한 사용자의 테넌트 접근 신청 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: USER_ERRORS.USER_NOT_FOUND }, 500)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK, {
		isArray: true,
		metaDto: TenantAccessRequestPaginationMetaDto,
	})
	@ResponseMessage("내 테넌트 접근 신청 목록 조회 성공")
	getMyRequests(@Query() query: QueryTenantAccessRequestDto) {
		const requesterId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.listMine({
			requesterId,
			where: query.toPrismaWhere(),
			orderBy: query.toPrismaOrderBy(),
			skip: query.skip,
			take: query.take,
		});
	}

	@Post(":tenantAccessRequestId/cancel")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "cancelTenantAccessRequest",
		summary: "테넌트 접근 신청 취소",
		description: "신청자가 본인의 PENDING 신청을 취소합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 403, message: "본인의 신청만 취소할 수 있습니다" },
		{ status: 404, message: "테넌트 접근 신청을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 취소 성공")
	cancel(
		@Param("tenantAccessRequestId", ParseUUIDPipe)
		tenantAccessRequestId: string,
	): Promise<TenantAccessRequest> {
		const requesterId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.cancel({
			tenantAccessRequestId,
			requesterId,
		});
	}

	@Get()
	@ApiOperation({
		operationId: "getTenantAccessRequests",
		summary: "테넌트 접근 신청 승인 목록 조회",
		description:
			"FULL_ACCESS는 전체 신청을, MANAGE는 본인이 관리하는 Space의 신청만 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 401, message: USER_ERRORS.USER_NOT_FOUND }, 500)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK, {
		isArray: true,
		metaDto: TenantAccessRequestPaginationMetaDto,
	})
	@ResponseMessage("테넌트 접근 신청 승인 목록 조회 성공")
	getRequests(@Query() query: QueryTenantAccessRequestDto) {
		const reviewerId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.listForReview({
			reviewerId,
			where: query.toPrismaWhere(),
			orderBy: query.toPrismaOrderBy(),
			skip: query.skip,
			take: query.take,
		});
	}

	@Get(":tenantAccessRequestId")
	@ApiOperation({
		operationId: "getTenantAccessRequest",
		summary: "테넌트 접근 신청 상세 조회",
		description:
			"FULL_ACCESS는 전체 신청을, MANAGE는 본인이 관리하는 Space의 신청만 상세 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 403, message: "해당 Space 신청을 처리할 권한이 없습니다" },
		{ status: 404, message: "테넌트 접근 신청을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 상세 조회 성공")
	getRequest(
		@Param("tenantAccessRequestId", ParseUUIDPipe)
		tenantAccessRequestId: string,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.getForReview({
			tenantAccessRequestId,
			reviewerId,
		});
	}

	@Post(":tenantAccessRequestId/approve")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "approveTenantAccessRequest",
		summary: "테넌트 접근 신청 승인",
		description:
			"승인 시 requester의 user+space Tenant를 생성하거나 roleId를 갱신합니다. MANAGE는 본인 Space의 non-FULL_ACCESS 신청만 승인할 수 있습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: ReviewTenantAccessRequestDto,
		description: "승인 코멘트",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 403, message: "해당 Space 신청을 처리할 권한이 없습니다" },
		{
			status: 403,
			message: "MANAGE 권한자는 FULL_ACCESS 역할 신청을 승인할 수 없습니다",
		},
		{ status: 404, message: "테넌트 접근 신청을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 승인 성공")
	approve(
		@Param("tenantAccessRequestId", ParseUUIDPipe)
		tenantAccessRequestId: string,
		@Body() dto: ReviewTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.approve({
			tenantAccessRequestId,
			reviewerId,
			dto,
		});
	}

	@Post(":tenantAccessRequestId/reject")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "rejectTenantAccessRequest",
		summary: "테넌트 접근 신청 반려",
		description:
			"FULL_ACCESS는 전체 신청을, MANAGE는 본인이 관리하는 Space의 신청만 반려합니다. FULL_ACCESS 역할 신청도 반려할 수 있습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: ReviewTenantAccessRequestDto,
		description: "반려 코멘트",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 403, message: "해당 Space 신청을 처리할 권한이 없습니다" },
		{ status: 404, message: "테넌트 접근 신청을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 반려 성공")
	reject(
		@Param("tenantAccessRequestId", ParseUUIDPipe)
		tenantAccessRequestId: string,
		@Body() dto: ReviewTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.tenantAccessRequestFacade.reject({
			tenantAccessRequestId,
			reviewerId,
			dto,
		});
	}

	private getAuthenticatedUserId(): string {
		this.authContext.assertAuthenticated();
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}
		return userId;
	}
}
