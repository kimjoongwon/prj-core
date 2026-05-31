import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { GetTaskRoutinesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTaskRoutinesQuery)
export class GetTaskRoutinesUseCase
	implements IQueryHandler<GetTaskRoutinesQuery>
{
	constructor(private readonly taskService: TaskAggregateRoot) {}

	execute(query: GetTaskRoutinesQuery): Promise<unknown> {
		return this.taskService.findTaskRoutines(query.taskId, query.spaceId);
	}
}
