import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { DeleteSessionCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
	implements ICommandHandler<DeleteSessionCommand>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(command: DeleteSessionCommand): Promise<void> {
		return this.timelinesService.deleteSessionFromTimeline(
			command.timelineId,
			command.sessionId,
		);
	}
}
