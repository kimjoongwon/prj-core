import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetTimelineByIdQuery } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTimelineByIdQuery)
export class GetTimelineByIdUseCase {
	constructor(
		private readonly timelinesService: TimelineAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(query: GetTimelineByIdQuery): Promise<unknown> {
		this.requireTimelineSpaceId();
		return this.timelinesService.findTimelineForSpace(
			query.timelineId,
			this.spaceContext.spaceIds,
		);
	}

	private requireTimelineSpaceId(): bigint {
		const spaceId = this.spaceContext.tenant?.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return spaceId;
	}
}
