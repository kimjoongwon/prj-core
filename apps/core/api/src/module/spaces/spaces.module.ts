import { SpaceContext } from "@cocrepo/context";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import { SpaceCommandHandlers, SpaceQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SpacesController } from "./spaces.controller";

@Module({
	imports: [CqrsModule],
	controllers: [SpacesController],
	providers: [
		SpaceAggregateRoot,
		SpacesRepository,
		SpaceContext,
		...SpaceCommandHandlers,
		...SpaceQueryHandlers,
	],
})
export class SpacesModule {}
