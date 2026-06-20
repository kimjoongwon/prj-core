import { RoutineAggregate } from "@cocrepo/aggregate";
import { DeleteRoutineCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteRoutineCommand)
export class DeleteRoutineUseCase
	implements ICommandHandler<DeleteRoutineCommand>
{
	constructor(private readonly routinesService: RoutineAggregate) {}

	execute(command: DeleteRoutineCommand): Promise<void> {
		return this.routinesService.removeRoutine(command.routineId);
	}
}
