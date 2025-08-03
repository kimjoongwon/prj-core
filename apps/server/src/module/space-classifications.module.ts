import { Module } from "@nestjs/common";
import {
	SpaceClassificationsController,
	SpaceClassificationsRepository,
	SpaceClassificationsService,
} from "@shared";

@Module({
	controllers: [SpaceClassificationsController],
	providers: [SpaceClassificationsService, SpaceClassificationsRepository],
})
export class SpaceClassificationsModule {}
