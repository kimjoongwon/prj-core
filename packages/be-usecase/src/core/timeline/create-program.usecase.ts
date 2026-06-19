import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { CreateProgramCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateProgramCommand)
export class CreateProgramUseCase
	implements ICommandHandler<CreateProgramCommand>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(command: CreateProgramCommand): Promise<unknown> {
		return this.timelinesService.createProgramInSession(command.sessionId, {
			name: command.input.name,
			routineId: command.input.routineId,
			instructorId: command.input.instructorId,
			capacity: command.input.capacity,
			level: command.input.level ?? null,
		});
	}
}
