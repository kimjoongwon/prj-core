import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetTimelinesQuery } from "@cocrepo/command";
import { TIMELINE_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/service";
import { buildOffsetStatsPaginatedResponse } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTimelinesQuery)
export class GetTimelinesUseCase implements IQueryHandler<GetTimelinesQuery> {
	constructor(
		private readonly timelinesService: TimelineAggregate,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetTimelinesQuery): Promise<unknown> {
		this.requireTimelineSpaceId();
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const timelineResult = await this.timelinesService.findTimelines({
			skip,
			take,
			search: query.query.search ?? null,
			contentLanguageCode: query.query.contentLanguageCode,
		});
		return buildOffsetStatsPaginatedResponse(
			timelineResult.timelines,
			timelineResult.total,
			skip,
			take,
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
