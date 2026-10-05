import { RoutineAggregate } from "@cocrepo/aggregate";
import { GetRoutineByIdQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoutineByIdQuery)
export class GetRoutineByIdUseCase {
	constructor(private readonly routinesService: RoutineAggregate) {}

	execute(query: GetRoutineByIdQuery): Promise<unknown> {
		const currentSpaceScope = "CURRENT" as NonNullable<typeof query.spaceScope>;
		return this.routinesService.findRoutineById(
			query.routineId,
			currentSpaceScope,
		);
	}
}
