import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { UpdateTaskExerciseCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateTaskExerciseCommand)
export class UpdateTaskExerciseUseCase
	implements ICommandHandler<UpdateTaskExerciseCommand>
{
	constructor(private readonly taskService: TaskAggregateRoot) {}

	execute(command: UpdateTaskExerciseCommand): Promise<unknown> {
		return this.taskService.updateTaskExercise(
			command.taskId,
			command.input,
			command.spaceId,
		);
	}
}
