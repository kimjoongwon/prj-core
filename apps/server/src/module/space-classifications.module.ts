import { SpaceClassificationsRepository } from "@cocrepo/repository";
import { SpaceClassificationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SpaceClassificationsController } from "@shared";

@Module({
	controllers: [SpaceClassificationsController],
	providers: [SpaceClassificationsService, SpaceClassificationsRepository],
})
export class SpaceClassificationsModule {}
