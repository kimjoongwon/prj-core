import { SpaceAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceCommandHandlers, SpaceQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SpacesController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [SpacesController],
	providers: [
		SpaceAggregate,
		SpacesRepository,
		SpaceContext,
		...SpaceCommandHandlers,
		...SpaceQueryHandlers,
	],
})
export class SpacesModule {}
