import { SpaceAssociationsRepository } from "@cocrepo/repository";
import { SpaceAssociationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpaceAssociationsController } from "@shared";

@Module({
	providers: [SpaceAssociationsService, SpaceAssociationsRepository],
	controllers: [SpaceAssociationsController],
})
export class SpaceAssociationsModule {}
