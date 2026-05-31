import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import { GetSpaceGroundQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSpaceGroundQuery)
export class GetSpaceGroundUseCase
	implements IQueryHandler<GetSpaceGroundQuery>
{
	constructor(private readonly spaceService: SpaceAggregateRoot) {}

	execute(query: GetSpaceGroundQuery): Promise<unknown> {
		return this.spaceService.getGroundBySpaceId(query.spaceId);
	}
}
