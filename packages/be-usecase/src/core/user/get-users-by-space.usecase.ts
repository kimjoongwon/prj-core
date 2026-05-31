import { GetUsersBySpaceQuery } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { buildOffsetPaginationMeta } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetUsersBySpaceQuery)
export class GetUsersBySpaceUseCase
	implements IQueryHandler<GetUsersBySpaceQuery>
{
	constructor(private readonly usersService: UserService) {}

	async execute(query: GetUsersBySpaceQuery): Promise<unknown> {
		const userResult = await this.usersService.getUsersBySpace(query.query);
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		return {
			data: userResult.users,
			meta: buildOffsetPaginationMeta(userResult.totalCount, skip, take),
			stats: userResult.stats,
		};
	}
}
