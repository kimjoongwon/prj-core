import { TaskAggregate } from "@cocrepo/aggregate";
import { UpdateTaskExerciseCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTaskExerciseCommand)
export class UpdateTaskExerciseUseCase {
	constructor(private readonly taskService: TaskAggregate) {}

	execute(command: UpdateTaskExerciseCommand): Promise<unknown> {
		return this.taskService.updateTaskExercise(
			command.taskId,
			command,
			command.spaceId,
		);
	}
}
