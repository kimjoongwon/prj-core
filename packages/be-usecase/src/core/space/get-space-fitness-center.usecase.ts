import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSpaceFitnessCenterQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSpaceFitnessCenterQuery)
export class GetSpaceFitnessCenterUseCase {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(query: GetSpaceFitnessCenterQuery): Promise<unknown> {
		return this.spaceService.getFitnessCenterBySpaceId(query.spaceId);
	}
}
