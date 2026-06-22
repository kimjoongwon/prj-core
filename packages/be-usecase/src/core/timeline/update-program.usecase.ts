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
				name: command.name,
				routineId: command.routineId,
				instructorId: command.instructorId,
				capacity: command.capacity,
				level: command.level,
			},
		);
	}
}
