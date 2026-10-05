import { TimelineAggregate } from "@cocrepo/aggregate";
import { CreateProgramCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateProgramCommand)
export class CreateProgramUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: CreateProgramCommand): Promise<unknown> {
		return this.timelinesService.createProgramInSession(command.sessionId, {
			name: command.name,
			routineId: command.routineId,
			instructorId: command.instructorId,
			capacity: command.capacity,
			level: command.level ?? null,
		});
	}
}
