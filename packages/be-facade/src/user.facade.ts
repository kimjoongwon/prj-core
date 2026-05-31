import { USER_ERRORS } from "@cocrepo/constant";
import { QueryUsersDto } from "@cocrepo/dto";
import { SpaceContext, UserService } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class UserFacade {
	constructor(
		private readonly usersService: UserService,
		private readonly spaceContext: SpaceContext,
	) {}

	getUsersBySpace(query: QueryUsersDto): Promise<
		OffsetPaginatedResponse<
			Awaited<ReturnType<UserService["getUsersBySpace"]>>["users"]
		> & {
			stats: Awaited<ReturnType<UserService["getUsersBySpace"]>>["stats"];
		}
	> {
		return this.getUsers(query);
	}

	async getUsers(query: QueryUsersDto): Promise<
		OffsetPaginatedResponse<
			Awaited<ReturnType<UserService["getUsersBySpace"]>>["users"]
		> & {
			stats: Awaited<ReturnType<UserService["getUsersBySpace"]>>["stats"];
		}
	> {
		const userResult = await this.usersService.getUsersBySpace(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return {
			...buildOffsetPaginatedResponse(
				userResult.users,
				userResult.totalCount,
				skip,
				take,
			),
			stats: userResult.stats,
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
}
