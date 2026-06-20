import { SpaceAggregate } from "@cocrepo/aggregate";
import { CreateSpaceCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateSpaceCommand)
export class CreateSpaceUseCase implements ICommandHandler<CreateSpaceCommand> {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(command: CreateSpaceCommand): Promise<unknown> {
		return this.spaceService.createSpaceWithGround(command.input);
	}
}
