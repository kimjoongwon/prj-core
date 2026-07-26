import {
	GetUserDetailForSpaceQuery,
	GetUsersBySpaceQuery,
	GetUserTenantDetailQuery,
} from "@cocrepo/command";
import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	QueryUsersDto,
	UserDetailResponseDto,
	UserDto,
	UserPaginationMetaDto,
	UserStatsDto,
	UserTenantDetailResponseDto,
} from "@cocrepo/dto";
import {
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("USERS")
@Controller()
export class UsersController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getUsers",
		summary: "사용자 목록 조회",
		description:
			"현재 x-tenant-id로 선택된 Tenant의 Space category scope 기준 사용자 목록을 조회합니다. 기본 scope는 현재 Space와 하위 Space입니다. 검색/필터링/페이지네이션과 통계 정보를 함께 반환합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UserDto, HttpStatus.OK, {
		isArray: true,
		metaDto: UserPaginationMetaDto,
		statsDto: UserStatsDto,
	})
	@ResponseMessage("회원 목록 조회 성공")
	async getUsers(@Query() query: QueryUsersDto) {
		return this.queryBus.execute(new GetUsersBySpaceQuery(query));
	}

	@Get(":userId")
	@ApiOperation({
		operationId: "getUserById",
		summary: "사용자 상세 조회",
		description:
			"특정 사용자의 상세 정보를 조회합니다. Profile, Tenant, Role, Space 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "userId",
		description: "사용자 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: USER_ERRORS.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UserDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("회원 상세 조회 성공")
	async getUserById(@Param("userId", ParseUUIDPipe) userId: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(
			new GetUserDetailForSpaceQuery(userId, spaceId),
		);
	}

	@Get(":userId/tenants/:tenantId")
	@ApiOperation({
		operationId: "getUserTenantDetail",
		summary: "사용자 Tenant 상세 조회",
		description:
			"현재 Space에서 사용자에게 속한 Tenant와 Role 정책 할당 및 권한 항목을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiParam({ name: "tenantId", description: "Tenant ID (UUID)", type: String })
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: USER_ERRORS.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UserTenantDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("사용자 테넌트 상세 조회 성공")
	async getUserTenantDetail(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Param("tenantId", ParseUUIDPipe) tenantId: string,
	) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(
			new GetUserTenantDetailQuery(userId, tenantId, spaceId),
		);
	}
}
