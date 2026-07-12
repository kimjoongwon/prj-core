import { SpaceAggregate } from "@cocrepo/aggregate";
import { UpdateSpaceGroundCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSpaceGroundCommand)
export class UpdateSpaceGroundUseCase {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(command: UpdateSpaceGroundCommand): Promise<unknown> {
		return this.spaceService.updateGroundBySpaceId(command.spaceId, command);
	}
}
