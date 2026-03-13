import { SpaceFacade } from "@cocrepo/facade";
import { SpaceService } from "@cocrepo/service";
import { SpacesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";

@Module({
	controllers: [SpacesController],
	providers: [SpaceFacade, SpaceService, SpacesRepository],
	exports: [SpaceFacade],
})
export class SpacesModule {}
