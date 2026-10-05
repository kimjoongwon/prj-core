import { TimelineAggregate } from "@cocrepo/aggregate";
import { DeleteSessionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: DeleteSessionCommand): Promise<void> {
		return this.timelinesService.deleteSessionFromTimeline(
			command.timelineId,
			command.sessionId,
		);
	}
}
