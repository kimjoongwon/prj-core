import { TimelineAggregate } from "@cocrepo/aggregate";
import { GetProgramByIdQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetProgramByIdQuery)
export class GetProgramByIdUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(query: GetProgramByIdQuery): Promise<unknown> {
		return this.timelinesService.findProgramInSession(
			query.sessionId,
			query.programId,
		);
	}
}
