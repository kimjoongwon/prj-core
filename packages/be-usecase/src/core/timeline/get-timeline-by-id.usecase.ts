import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { GetTimelineByIdQuery } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTimelineByIdQuery)
export class GetTimelineByIdUseCase
	implements IQueryHandler<GetTimelineByIdQuery>
{
	constructor(
		private readonly timelinesService: TimelineAggregateRoot,
		private readonly spaceContext: SpaceContext,
	) {}

	execute(query: GetTimelineByIdQuery): Promise<unknown> {
		this.requireTimelineSpaceId();
		return this.timelinesService.findTimelineForSpace(
			query.timelineId,
			this.spaceContext.spaceIds,
		);
	}

	private requireTimelineSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(TIMELINE_ERRORS.INVALID_DATA);
		}
		return spaceId;
	}
}
