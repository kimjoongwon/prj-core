import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { GetSessionByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSessionByIdQuery)
export class GetSessionByIdUseCase
	implements IQueryHandler<GetSessionByIdQuery>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(query: GetSessionByIdQuery): Promise<unknown> {
		return this.timelinesService.findSessionInTimeline(
			query.timelineId,
			query.sessionId,
		);
	}
}
