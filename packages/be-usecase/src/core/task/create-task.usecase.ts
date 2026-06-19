import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { CreateTaskCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTaskCommand)
export class CreateTaskUseCase implements ICommandHandler<CreateTaskCommand> {
	constructor(private readonly taskService: TaskAggregateRoot) {}

	execute(command: CreateTaskCommand): Promise<unknown> {
		return this.taskService.createTaskWithExercise(
			command.input,
			command.spaceId,
			command.creatorId,
		);
	}
}
