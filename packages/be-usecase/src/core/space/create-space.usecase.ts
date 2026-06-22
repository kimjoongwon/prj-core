import { SpaceAggregate } from "@cocrepo/aggregate";
import { CreateSpaceCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateSpaceCommand)
export class CreateSpaceUseCase {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(command: CreateSpaceCommand): Promise<unknown> {
		return this.spaceService.createSpaceWithGround(command);
	}
}
