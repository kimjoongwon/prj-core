import { SpacesApplicationService } from "@cocrepo/app";
import { SpacesRepository } from "@cocrepo/repository";
import { SpacesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";

@Module({
	controllers: [SpacesController],
	providers: [SpacesApplicationService, SpacesService, SpacesRepository],
	exports: [SpacesApplicationService],
})
export class SpacesModule {}
