import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { GetProgramsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetProgramsQuery)
export class GetProgramsUseCase implements IQueryHandler<GetProgramsQuery> {
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	async execute(query: GetProgramsQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const programResult = await this.timelinesService.findProgramsInSession(
			query.sessionId,
			{
				skip,
				take,
			},
		);
		return buildOffsetPaginatedResponse(
			programResult.programs,
			programResult.total,
			skip,
			take,
		);
	}
}
