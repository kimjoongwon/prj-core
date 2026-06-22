import { GetUsersBySpaceQuery } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { buildOffsetPaginationMeta } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetUsersBySpaceQuery)
export class GetUsersBySpaceUseCase {
	constructor(private readonly usersService: UserService) {}

	async execute(query: GetUsersBySpaceQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const userResult = await this.usersService.getUsersBySpace({
			...query,
			skip,
			take,
		});
		return {
			data: userResult.users,
			meta: buildOffsetPaginationMeta(userResult.totalCount, skip, take),
			stats: userResult.stats,
		};
	}
}
