import { RoutineAggregate } from "@cocrepo/aggregate";
import { GetRoutineByIdQuery } from "@cocrepo/command";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoutineByIdQuery)
export class GetRoutineByIdUseCase {
	constructor(private readonly routinesService: RoutineAggregate) {}

	execute(query: GetRoutineByIdQuery): Promise<unknown> {
		return this.routinesService.findRoutineById(
			query.routineId,
			SpaceScopeEnum.CURRENT,
		);
	}
}
