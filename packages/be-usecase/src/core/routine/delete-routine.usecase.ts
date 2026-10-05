import { RoutineAggregate } from "@cocrepo/aggregate";
import { DeleteRoutineCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteRoutineCommand)
export class DeleteRoutineUseCase {
	constructor(private readonly routinesService: RoutineAggregate) {}

	execute(command: DeleteRoutineCommand): Promise<void> {
		return this.routinesService.removeRoutine(command.routineId);
	}
}
