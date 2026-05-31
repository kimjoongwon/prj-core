import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { DeleteProgramCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteProgramCommand)
export class DeleteProgramUseCase
	implements ICommandHandler<DeleteProgramCommand>
{
	constructor(private readonly timelinesService: TimelineAggregateRoot) {}

	execute(command: DeleteProgramCommand): Promise<void> {
		return this.timelinesService.deleteProgramFromSession(
			command.sessionId,
			command.programId,
		);
	}
}
