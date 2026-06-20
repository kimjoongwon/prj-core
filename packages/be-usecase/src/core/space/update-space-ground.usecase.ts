import { SpaceAggregate } from "@cocrepo/aggregate";
import { UpdateSpaceGroundCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSpaceGroundCommand)
export class UpdateSpaceGroundUseCase
	implements ICommandHandler<UpdateSpaceGroundCommand>
{
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(command: UpdateSpaceGroundCommand): Promise<unknown> {
		return this.spaceService.updateGroundBySpaceId(
			command.spaceId,
			command.input,
		);
	}
}
