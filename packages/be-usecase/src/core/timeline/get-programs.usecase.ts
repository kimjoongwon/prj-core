import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetProgramsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetProgramsQuery)
export class GetProgramsUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	async execute(query: GetProgramsQuery): Promise<unknown> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
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
