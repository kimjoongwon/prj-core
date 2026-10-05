import { TimelineAggregate } from "@cocrepo/aggregate";
import { CreateSessionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: CreateSessionCommand): Promise<unknown> {
		return this.timelinesService.createSessionInTimeline(
			command.timelineId,
			command,
		);
	}
}
