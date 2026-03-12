import { SpacesApplicationService } from "@cocrepo/app";
import { SpacesService } from "@cocrepo/service";
import { SpacesRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";

@Module({
	controllers: [SpacesController],
	providers: [SpacesApplicationService, SpacesService, SpacesRepository],
	exports: [SpacesApplicationService],
})
export class SpacesModule {}
