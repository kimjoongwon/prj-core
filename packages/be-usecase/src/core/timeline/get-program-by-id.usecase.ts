import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetProgramByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetProgramByIdQuery)
export class GetProgramByIdUseCase
	implements IQueryHandler<GetProgramByIdQuery>
{
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(query: GetProgramByIdQuery): Promise<unknown> {
		return this.timelinesService.findProgramInSession(
			query.sessionId,
			query.programId,
		);
	}
}
