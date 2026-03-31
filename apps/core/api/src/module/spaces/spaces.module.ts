import { SpaceContext } from "@cocrepo/context";
import { SpaceFacade } from "@cocrepo/facade";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";

@Module({
	controllers: [SpacesController],
	providers: [SpaceFacade, SpaceService, SpacesRepository, SpaceContext],
	exports: [SpaceFacade],
})
export class SpacesModule {}
