import { SpaceFacade } from "@cocrepo/facade";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";

@Module({
	controllers: [SpacesController],
	providers: [SpaceFacade, SpaceService, SpacesRepository],
	exports: [SpaceFacade],
})
export class SpacesModule {}
