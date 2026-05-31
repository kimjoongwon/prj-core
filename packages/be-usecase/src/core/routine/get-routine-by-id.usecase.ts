import { RoutineAggregateRoot } from "@cocrepo/aggregate";
import { GetRoutineByIdQuery } from "@cocrepo/command";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoutineByIdQuery)
export class GetRoutineByIdUseCase
	implements IQueryHandler<GetRoutineByIdQuery>
{
	constructor(private readonly routinesService: RoutineAggregateRoot) {}

	execute(query: GetRoutineByIdQuery): Promise<unknown> {
		return this.routinesService.findRoutineById(
			query.routineId,
			SpaceScopeEnum.CURRENT,
		);
	}
}
