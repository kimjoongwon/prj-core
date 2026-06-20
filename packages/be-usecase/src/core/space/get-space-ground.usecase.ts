import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSpaceGroundQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSpaceGroundQuery)
export class GetSpaceGroundUseCase {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(query: GetSpaceGroundQuery): Promise<unknown> {
		return this.spaceService.getGroundBySpaceId(query.spaceId);
	}
}
