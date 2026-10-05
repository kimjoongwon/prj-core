import { TimelineAggregate } from "@cocrepo/aggregate";
import { DeleteProgramCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteProgramCommand)
export class DeleteProgramUseCase {
	constructor(private readonly timelinesService: TimelineAggregate) {}

	execute(command: DeleteProgramCommand): Promise<void> {
		return this.timelinesService.deleteProgramFromSession(
			command.sessionId,
			command.programId,
		);
	}
}
