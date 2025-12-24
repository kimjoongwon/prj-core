import { SpacesRepository } from "@cocrepo/repository";
import { SpacesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpacesController } from "@shared";

@Module({
	controllers: [SpacesController],
	providers: [SpacesService, SpacesRepository],
})
export class SpacesModule {}
