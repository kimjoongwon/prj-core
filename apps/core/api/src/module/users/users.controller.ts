import { USER_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { UserFacade } from "@cocrepo/facade";
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
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("USERS")
@Controller()
export class UsersController {
	constructor(
		private readonly usersService: UserFacade,
		private readonly spaceContext: SpaceContext,
		private readonly authContext: AuthContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getUsers",
		summary: "사용자 목록 조회",
		description:
			"현재 Space 내의 사용자 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원하며 통계 정보도 함께 반환합니다.",
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
	@ResponseMessage("common.user.list.success")
	async getUsers(@Query() query: QueryUsersDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.usersService.getUsersBySpace(query);
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
	@ResponseMessage("common.user.read.success")
	async getUserById(@Param("id", ParseUUIDPipe) id: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.usersService.getUserDetailForSpace(id, spaceId);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteUser",
		summary: "사용자 삭제",
		description:
			"사용자를 삭제합니다 (Soft Delete). 자신의 계정은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "사용자 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 400, message: USER_ERRORS.CANNOT_DELETE_SELF },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: USER_ERRORS.USER_NOT_FOUND },
		500,
	)
	@ResponseMessage("common.user.delete.success")
	async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const currentUserId = this.authContext.user?.id;
		if (!currentUserId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.usersService.deleteUserForSpace(id, spaceId);
	}
}
