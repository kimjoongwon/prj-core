import { TaskAggregate } from "@cocrepo/aggregate";
import { CreateTaskCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateTaskCommand)
export class CreateTaskUseCase {
	constructor(private readonly taskService: TaskAggregate) {}

	execute(command: CreateTaskCommand): Promise<unknown> {
		return this.taskService.createTaskWithExercise(
			command.input,
			command.spaceId,
			command.creatorId,
		);
	}
}
