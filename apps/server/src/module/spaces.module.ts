import { Module } from "@nestjs/common";
import { SpacesController, SpacesRepository, SpacesService } from "@shared";

@Module({
	controllers: [SpacesController],
	providers: [SpacesService, SpacesRepository],
})
export class SpacesModule {}
