import { SpaceAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { SpacesController } from "@cocrepo/controller";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceCommandHandlers, SpaceQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
