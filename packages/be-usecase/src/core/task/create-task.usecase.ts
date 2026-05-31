import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { CreateTaskCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTaskCommand)
export class CreateTaskUseCase implements ICommandHandler<CreateTaskCommand> {
	constructor(private readonly taskService: TaskAggregateRoot) {}

	execute(command: CreateTaskCommand): Promise<unknown> {
		return this.taskService.createTaskWithExercise(
			command.dto,
			command.spaceId,
			command.creatorId,
		);
	}
}
