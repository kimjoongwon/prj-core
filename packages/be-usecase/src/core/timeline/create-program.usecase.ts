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
			name: command.dto.name,
			routineId: command.dto.routineId,
			instructorId: command.dto.instructorId,
			capacity: command.dto.capacity,
			level: command.dto.level ?? null,
		});
	}
}
