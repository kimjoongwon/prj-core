import { TaskAggregate } from "@cocrepo/aggregate";
import { GetTaskExerciseQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTaskExerciseQuery)
export class GetTaskExerciseUseCase {
	constructor(private readonly taskService: TaskAggregate) {}

	execute(query: GetTaskExerciseQuery): Promise<unknown> {
		const currentSpaceScope = "CURRENT" as NonNullable<typeof query.spaceScope>;
		return this.taskService.getExerciseByTaskId(
			query.taskId,
			query.spaceId,
			query.spaceScope ?? currentSpaceScope,
		);
	}
}
