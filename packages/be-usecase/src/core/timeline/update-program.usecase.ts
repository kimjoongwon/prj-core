import { TimelineAggregate } from "@cocrepo/aggregate";
import { UpdateProgramCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateProgramCommand)
export class UpdateProgramUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: UpdateProgramCommand): Promise<unknown> {
		return this.timelinesService.updateProgramInSession(
			command.sessionSeq,
			command.programSeq,
			{
				name: command.name,
				routineSeq: command.routineSeq,
				instructorSeq: command.instructorSeq,
				capacity: command.capacity,
				level: command.level,
			},
		);
	}
}
