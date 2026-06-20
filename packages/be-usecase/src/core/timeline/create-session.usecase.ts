import { TimelineAggregate } from "@cocrepo/aggregate";
import { CreateSessionCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
	implements ICommandHandler<CreateSessionCommand>
{
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: CreateSessionCommand): Promise<unknown> {
		return this.timelinesService.createSessionInTimeline(
			command.timelineId,
			command.input,
		);
	}
}
