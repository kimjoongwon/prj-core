import { GetUserDetailForSpaceQuery } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetUserDetailForSpaceQuery)
export class GetUserDetailForSpaceUseCase
	implements IQueryHandler<GetUserDetailForSpaceQuery>
{
	constructor(private readonly usersService: UserService) {}

	execute(query: GetUserDetailForSpaceQuery): Promise<unknown> {
		return this.usersService.getUserDetailForSpace(query.userId, query.spaceId);
	}
}
