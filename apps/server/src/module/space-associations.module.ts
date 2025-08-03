import { Module } from "@nestjs/common";
import {
	SpaceAssociationsController,
	SpaceAssociationsRepository,
	SpaceAssociationsService,
} from "@shared";

@Module({
	providers: [SpaceAssociationsService, SpaceAssociationsRepository],
	controllers: [SpaceAssociationsController],
})
export class SpaceAssociationsModule {}
