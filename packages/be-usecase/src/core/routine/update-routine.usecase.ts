import { RoutineAggregate } from "@cocrepo/aggregate";
import { UpdateRoutineCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateRoutineCommand)
export class UpdateRoutineUseCase {
	constructor(private readonly routinesService: RoutineAggregate) {}

	execute(command: UpdateRoutineCommand): Promise<unknown> {
		return this.routinesService.updateRoutine(command.routineId, command);
	}
}
