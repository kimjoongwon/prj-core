import { Module } from "@nestjs/common";
import {
	ContextService,
	SpacesController,
	SpacesRepository,
	SpacesService,
} from "@shared";

@Module({
	controllers: [SpacesController],
	providers: [SpacesService, SpacesRepository, ContextService],
})
export class SpacesModule {}
