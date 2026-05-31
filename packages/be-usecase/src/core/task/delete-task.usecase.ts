import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { DeleteTaskCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskUseCase implements ICommandHandler<DeleteTaskCommand> {
	constructor(private readonly taskService: TaskAggregateRoot) {}

	async execute(command: DeleteTaskCommand): Promise<void> {
		await this.taskService.deleteTask(command.taskId, command.spaceId);
	}
}
