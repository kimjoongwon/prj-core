import { TimelineAggregate } from "@cocrepo/aggregate";
import { UpdateProgramCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateProgramCommand)
export class UpdateProgramUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: UpdateProgramCommand): Promise<unknown> {
		return this.timelinesService.updateProgramInSession(
			command.sessionId,
			command.programId,
			{
				name: command.input.name,
				routineId: command.input.routineId,
				instructorId: command.input.instructorId,
				capacity: command.input.capacity,
				level: command.input.level,
			},
		);
	}
}
