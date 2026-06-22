import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetSessionsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSessionsQuery)
export class GetSessionsUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	async execute(query: GetSessionsQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const sessionResult = await this.timelinesService.findSessionsInTimeline(
			query.timelineId,
			{
				skip,
				take,
			},
		);
		return buildOffsetPaginatedResponse(
			sessionResult.sessions,
			sessionResult.total,
			skip,
			take,
		);
	}
}
