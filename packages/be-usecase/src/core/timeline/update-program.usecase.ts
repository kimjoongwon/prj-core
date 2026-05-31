import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { UpdateProgramCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateProgramCommand)
export class UpdateProgramUseCase
	implements ICommandHandler<UpdateProgramCommand>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(command: UpdateProgramCommand): Promise<unknown> {
		return this.timelinesService.updateProgramInSession(
			command.sessionId,
			command.programId,
			{
				name: command.dto.name,
				routineId: command.dto.routineId,
				instructorId: command.dto.instructorId,
				capacity: command.dto.capacity,
				level: command.dto.level,
			},
		);
	}
}
