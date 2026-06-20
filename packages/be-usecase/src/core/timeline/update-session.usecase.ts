import { TimelineAggregate } from "@cocrepo/aggregate";
import { UpdateSessionCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: UpdateSessionCommand): Promise<unknown> {
		return this.timelinesService.updateSessionInTimeline(
			command.timelineId,
			command.sessionId,
			command.input,
		);
	}
}
