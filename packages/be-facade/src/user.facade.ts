import { USER_ERRORS } from "@cocrepo/constant";
import {
	CreateUserMemberDto,
	QueryUsersDto,
	UpdateUserMemberDto,
} from "@cocrepo/dto";
import { AuthContext, SpaceContext, UserService } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class UserFacade {
	constructor(
		private readonly usersService: UserService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	getUsersBySpace(query: QueryUsersDto): Promise<{
		data: Awaited<ReturnType<UserService["getUsersBySpace"]>>["users"];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
		stats: Awaited<ReturnType<UserService["getUsersBySpace"]>>["stats"];
	}> {
		return this.getUsers(query);
	}

	async getUsers(query: QueryUsersDto): Promise<{
		data: Awaited<ReturnType<UserService["getUsersBySpace"]>>["users"];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
		stats: Awaited<ReturnType<UserService["getUsersBySpace"]>>["stats"];
	}> {
		const { users, totalCount, stats } =
			await this.usersService.getUsersBySpace(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return {
			data: users,
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
			stats,
		};
	}

	getUserDetailForSpace(userId: string, _spaceId: string) {
		return this.usersService.getUserDetailForSpace(userId, _spaceId);
	}

	getUserById(userId: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.usersService.getUserDetailForSpace(userId, spaceId);
	}

	createUserForSpace(input: Parameters<UserService["createUserForSpace"]>[0]) {
		return this.usersService.createUserForSpace(input);
	}

	createUser(dto: CreateUserMemberDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

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

	updateUserForSpace(
		userId: string,
		spaceId: string,
		dto: Parameters<UserService["updateUserForSpace"]>[2],
	) {
		return this.usersService.updateUserForSpace(userId, spaceId, dto);
	}

	updateUser(userId: string, dto: UpdateUserMemberDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.usersService.updateUserForSpace(userId, spaceId, {
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			categoryId: dto.categoryId,
			groupIds: dto.groupIds,
		});
	}

	async deleteUserForSpace(userId: string, spaceId: string): Promise<void> {
		const currentUserId = this.authContext.user?.id;
		if (!currentUserId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.usersService.deleteUserForSpace(userId, spaceId, currentUserId);
	}

	async deleteUser(userId: string): Promise<void> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const currentUserId = this.authContext.user?.id;
		if (!currentUserId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		await this.usersService.deleteUserForSpace(userId, spaceId, currentUserId);
	}
}
