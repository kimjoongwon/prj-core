import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateUserMemberDto,
	QueryUsersDto,
	UpdateUserMemberDto,
	UserDetailResponseDto,
	UserDto,
	UserPaginationMetaDto,
	UserStatsDto,
} from "@cocrepo/dto";
import { User } from "@cocrepo/entity";
import { UsersService } from "@cocrepo/service";
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

@ApiTags("USERS")
@Controller()
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
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
	private getCurrentUser(): User {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}
		return user;
	}

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
		const { users, totalCount, stats } =
			await this.usersService.getUsersBySpace(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return wrapResponse(users, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
			stats,
		});
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
		const spaceId = this.getSpaceId();

		return this.usersService.getUserDetailForSpace(id, spaceId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createUser",
		summary: "사용자 등록",
		description:
			"새로운 사용자를 등록합니다. 이메일, 전화번호, 이름은 중복될 수 없습니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateUserMemberDto,
		description: "사용자 등록 정보",
	})
	@ApiErrors(
		{ status: 400, message: USER_ERRORS.EMAIL_ALREADY_EXISTS },
		{ status: 400, message: USER_ERRORS.PHONE_ALREADY_EXISTS },
		{ status: 400, message: USER_ERRORS.NAME_ALREADY_EXISTS },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UserDto, HttpStatus.CREATED)
	@ResponseMessage("common.user.create.success")
	async createUser(@Body() dto: CreateUserMemberDto) {
		const spaceId = this.getSpaceId();

		return this.usersService.createUserForSpace({
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			password: dto.password,
			roleId: dto.roleId,
			spaceId,
			categoryId: dto.categoryId,
			groupIds: dto.groupIds,
		});
	}

	@Patch(":id")
	@ApiOperation({
		operationId: "updateUser",
		summary: "사용자 수정",
		description: "사용자 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "사용자 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateUserMemberDto,
		description: "사용자 수정 정보",
	})
	@ApiErrors(
		{ status: 400, message: USER_ERRORS.EMAIL_ALREADY_EXISTS },
		{ status: 400, message: USER_ERRORS.PHONE_ALREADY_EXISTS },
		{ status: 400, message: USER_ERRORS.NAME_ALREADY_EXISTS },
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: USER_ERRORS.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	@ResponseMessage("common.user.update.success")
	async updateUser(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateUserMemberDto,
	) {
		const spaceId = this.getSpaceId();

		return this.usersService.updateUserForSpace(id, spaceId, {
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			categoryId: dto.categoryId,
			groupIds: dto.groupIds,
		});
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
		const spaceId = this.getSpaceId();
		const currentUser = this.getCurrentUser();

		await this.usersService.deleteUserForSpace(id, spaceId, currentUser.id);
	}
}
