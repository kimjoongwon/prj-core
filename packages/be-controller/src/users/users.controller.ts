import {
	GetUserDetailForSpaceQuery,
	GetUsersBySpaceQuery,
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
			"현재 x-space-id로 선택된 Tenant의 role이 FULL_ACCESS면 전체 사용자 목록을, 그 외에는 현재 Space 기준 사용자 목록을 조회합니다. 검색/필터링/페이지네이션과 통계 정보를 함께 반환합니다.",
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

	@Get(":id")
	@ApiOperation({
		operationId: "getUserById",
		summary: "사용자 상세 조회",
		description:
			"특정 사용자의 상세 정보를 조회합니다. Profile, Tenant, Role, Space 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
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
	async getUserById(@Param("id", ParseUUIDPipe) id: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(new GetUserDetailForSpaceQuery(id, spaceId));
	}
}
