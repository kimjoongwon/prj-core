import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { GetTaskExerciseQuery } from "@cocrepo/command";
import { SpaceScope as SpaceScopeEnum } from "@cocrepo/dto";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTaskExerciseQuery)
export class GetTaskExerciseUseCase
	implements IQueryHandler<GetTaskExerciseQuery>
{
	constructor(private readonly taskService: TaskAggregateRoot) {}

	execute(query: GetTaskExerciseQuery): Promise<unknown> {
		return this.taskService.getExerciseByTaskId(
			query.taskId,
			query.spaceId,
			query.spaceScope ?? SpaceScopeEnum.CURRENT,
		);
	}
}
