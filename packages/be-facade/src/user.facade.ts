import { USER_ERRORS } from "@cocrepo/constant";
import {
	QueryUsersDto,
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
