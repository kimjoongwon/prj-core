import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { GetSessionsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSessionsQuery)
export class GetSessionsUseCase implements IQueryHandler<GetSessionsQuery> {
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	async execute(query: GetSessionsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
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
