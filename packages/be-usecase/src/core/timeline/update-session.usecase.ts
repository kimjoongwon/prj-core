import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { UpdateSessionCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
	implements ICommandHandler<UpdateSessionCommand>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(command: UpdateSessionCommand): Promise<unknown> {
		return this.timelinesService.updateSessionInTimeline(
			command.timelineId,
			command.sessionId,
			command.input,
		);
	}
}
