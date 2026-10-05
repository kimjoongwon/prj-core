import { SpaceAggregate } from "@cocrepo/aggregate";
import { UpdateSpaceFitnessCenterCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSpaceFitnessCenterCommand)
export class UpdateSpaceFitnessCenterUseCase {
	constructor(private readonly spaceService: SpaceAggregate) {}

	execute(command: UpdateSpaceFitnessCenterCommand): Promise<unknown> {
		return this.spaceService.updateFitnessCenterBySpaceId(
			command.spaceId,
			command,
		);
	}
}
