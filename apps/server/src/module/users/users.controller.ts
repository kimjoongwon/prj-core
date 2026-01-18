import { CONTEXT_KEYS } from "@cocrepo/constant";
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
	UserListResponseDto,
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
import { plainToInstance } from "class-transformer";
import { ClsService } from "nestjs-cls";

/**
 * Users 에러 메시지 상수
 */
const UsersErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	SPACE_NOT_SELECTED:
		"Space가 선택되지 않았습니다. X-Space-ID 헤더를 확인해주세요.",
	EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",
	PHONE_ALREADY_EXISTS: "이미 사용 중인 전화번호입니다",
	NAME_ALREADY_EXISTS: "이미 사용 중인 이름입니다",
	CANNOT_DELETE_SELF: "자신의 계정은 삭제할 수 없습니다",
} as const;

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
			throw new UnauthorizedException(UsersErrorMessages.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}

	/**
	 * 현재 로그인한 사용자를 가져옵니다.
	 */
	private getCurrentUser(): User {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(UsersErrorMessages.USER_NOT_FOUND);
		}
		return user;
	}

	@Get()
	@ApiOperation({
		operationId: "getUsers",
		summary: "회원 목록 조회",
		description:
			"현재 Space 내의 회원 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원하며 통계 정보도 함께 반환합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UsersErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UserListResponseDto, HttpStatus.OK)
	@ResponseMessage("회원 목록 조회 성공")
	async getUsers(@Query() query: QueryUsersDto): Promise<UserListResponseDto> {
		const spaceId = this.getSpaceId();

		const { users, totalCount, stats } =
			await this.usersService.getMembersBySpace({
				spaceId,
				search: query.search,
				roles: query.roles,
				status: query.status,
				categoryId: query.categoryId,
				groupIds: query.groupIds,
				createdFrom: query.createdFrom,
				createdTo: query.createdTo,
				sortBy: query.sortBy,
				sortOrder: query.sortOrder,
				skip: query.getSkip(),
				take: query.getTake(),
			});

		const limit = query.limit ?? 20;
		const page = query.page ?? 1;

		return {
			data: users.map((user) => plainToInstance(UserDto, user)),
			meta: plainToInstance(UserPaginationMetaDto, {
				total: totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
			}),
			stats: plainToInstance(UserStatsDto, stats),
		};
	}

	@Get(":id")
	@ApiOperation({
		operationId: "getUserById",
		summary: "회원 상세 조회",
		description:
			"특정 회원의 상세 정보를 조회합니다. Profile, Tenant, Role, Space 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "회원 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UsersErrorMessages.SPACE_NOT_SELECTED },
		{ status: 404, message: UsersErrorMessages.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UserDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("회원 상세 조회 성공")
	async getUserById(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<UserDetailResponseDto> {
		const spaceId = this.getSpaceId();

		const user = await this.usersService.getMemberDetailForSpace(id, spaceId);

		return plainToInstance(UserDetailResponseDto, user);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createUser",
		summary: "회원 등록",
		description:
			"새로운 회원을 등록합니다. 이메일, 전화번호, 이름은 중복될 수 없습니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateUserMemberDto,
		description: "회원 등록 정보",
	})
	@ApiErrors(
		{ status: 400, message: UsersErrorMessages.EMAIL_ALREADY_EXISTS },
		{ status: 400, message: UsersErrorMessages.PHONE_ALREADY_EXISTS },
		{ status: 400, message: UsersErrorMessages.NAME_ALREADY_EXISTS },
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UsersErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(UserDto, HttpStatus.CREATED)
	@ResponseMessage("회원 등록 성공")
	async createUser(@Body() dto: CreateUserMemberDto): Promise<UserDto> {
		const spaceId = this.getSpaceId();

		const user = await this.usersService.createMemberForSpace({
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			password: dto.password,
			roleId: dto.roleId,
			spaceId,
			categoryId: dto.categoryId,
			groupIds: dto.groupIds,
		});

		return plainToInstance(UserDto, user);
	}

	@Patch(":id")
	@ApiOperation({
		operationId: "updateUser",
		summary: "회원 수정",
		description: "회원 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "회원 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateUserMemberDto,
		description: "회원 수정 정보",
	})
	@ApiErrors(
		{ status: 400, message: UsersErrorMessages.EMAIL_ALREADY_EXISTS },
		{ status: 400, message: UsersErrorMessages.PHONE_ALREADY_EXISTS },
		{ status: 400, message: UsersErrorMessages.NAME_ALREADY_EXISTS },
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UsersErrorMessages.SPACE_NOT_SELECTED },
		{ status: 404, message: UsersErrorMessages.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	@ResponseMessage("회원 수정 성공")
	async updateUser(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateUserMemberDto,
	): Promise<UserDto> {
		const spaceId = this.getSpaceId();

		const user = await this.usersService.updateMemberForSpace(id, spaceId, {
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			categoryId: dto.categoryId,
			groupIds: dto.groupIds,
		});

		return plainToInstance(UserDto, user);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteUser",
		summary: "회원 삭제",
		description:
			"회원을 삭제합니다 (Soft Delete). 자신의 계정은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "회원 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 400, message: UsersErrorMessages.CANNOT_DELETE_SELF },
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: UsersErrorMessages.SPACE_NOT_SELECTED },
		{ status: 404, message: UsersErrorMessages.USER_NOT_FOUND },
		500,
	)
	@ResponseMessage("회원 삭제 성공")
	async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
		const spaceId = this.getSpaceId();
		const currentUser = this.getCurrentUser();

		await this.usersService.deleteMemberForSpace(id, spaceId, currentUser.id);
	}
}
