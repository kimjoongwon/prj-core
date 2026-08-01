import { ParseUlidPipe } from "@cocrepo/be-common";
import {
	ApproveTenantAccessRequestCommand,
	GetTenantAccessRequestForReviewQuery,
	ListTenantAccessRequestsForReviewQuery,
	RejectTenantAccessRequestCommand,
} from "@cocrepo/command";
import { USER_ERRORS } from "@cocrepo/constant";
import { AuthContext } from "@cocrepo/context";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	QueryTenantAccessRequestDto,
	ReviewTenantAccessRequestDto,
	TenantAccessRequestDto,
	TenantAccessRequestPaginationMetaDto,
} from "@cocrepo/dto";
import { TenantAccessRequest } from "@cocrepo/entity";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TENANT_ACCESS_REQUESTS")
@SkipSpaceCheck()
@Controller()
export class TenantAccessRequestsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
		private readonly authContext: AuthContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getTenantAccessRequests",
		summary: "테넌트 접근 신청 승인 목록 조회",
		description:
			"PLATFORM_ADMIN은 전체 신청을, COMPANY_MANAGER는 본인이 관리하는 Space의 신청만 조회합니다.",
	})
	@ApiAuth({ tenantHeader: false })
	@ApiErrors({ status: 401, message: USER_ERRORS.USER_NOT_FOUND }, 500)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK, {
		isArray: true,
		metaDto: TenantAccessRequestPaginationMetaDto,
	})
	@ResponseMessage("테넌트 접근 신청 승인 목록 조회 성공")
	getRequests(@Query() query: QueryTenantAccessRequestDto) {
		const reviewerId = this.getAuthenticatedUserId();
		return this.queryBus.execute(
			new ListTenantAccessRequestsForReviewQuery({
				...query,
				reviewerId,
			}),
		);
	}

	@Get(":tenantAccessRequestId")
	@ApiOperation({
		operationId: "getTenantAccessRequest",
		summary: "테넌트 접근 신청 상세 조회",
		description:
			"PLATFORM_ADMIN은 전체 신청을, COMPANY_MANAGER는 본인이 관리하는 Space의 신청만 상세 조회합니다.",
	})
	@ApiAuth({ tenantHeader: false })
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (ULID)",
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
		@Param("tenantAccessRequestId", ParseUlidPipe)
		tenantAccessRequestId: string,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.queryBus.execute(
			new GetTenantAccessRequestForReviewQuery(
				tenantAccessRequestId,
				reviewerId,
			),
		);
	}

	@Post(":tenantAccessRequestId/approve")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "approveTenantAccessRequest",
		summary: "테넌트 접근 신청 승인",
		description:
			"승인 시 requester의 user+space Tenant를 생성하거나 roleId를 갱신합니다. COMPANY_MANAGER는 본인 Space의 non-PLATFORM_ADMIN 신청만 승인할 수 있습니다.",
	})
	@ApiAuth({ tenantHeader: false })
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (ULID)",
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
			message:
				"COMPANY_MANAGER 권한자는 PLATFORM_ADMIN 역할 신청을 승인할 수 없습니다",
		},
		{ status: 404, message: "테넌트 접근 신청을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(TenantAccessRequestDto, HttpStatus.OK)
	@ResponseMessage("테넌트 접근 신청 승인 성공")
	approve(
		@Param("tenantAccessRequestId", ParseUlidPipe)
		tenantAccessRequestId: string,
		@Body() dto: ReviewTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.commandBus.execute(
			new ApproveTenantAccessRequestCommand(
				tenantAccessRequestId,
				reviewerId,
				dto,
			),
		);
	}

	@Post(":tenantAccessRequestId/reject")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "rejectTenantAccessRequest",
		summary: "테넌트 접근 신청 반려",
		description:
			"PLATFORM_ADMIN은 전체 신청을, COMPANY_MANAGER는 본인이 관리하는 Space의 신청만 반려합니다. PLATFORM_ADMIN 역할 신청도 반려할 수 있습니다.",
	})
	@ApiAuth({ tenantHeader: false })
	@ApiParam({
		name: "tenantAccessRequestId",
		description: "테넌트 접근 신청 ID (ULID)",
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
		@Param("tenantAccessRequestId", ParseUlidPipe)
		tenantAccessRequestId: string,
		@Body() dto: ReviewTenantAccessRequestDto,
	): Promise<TenantAccessRequest> {
		const reviewerId = this.getAuthenticatedUserId();
		return this.commandBus.execute(
			new RejectTenantAccessRequestCommand(
				tenantAccessRequestId,
				reviewerId,
				dto,
			),
		);
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
