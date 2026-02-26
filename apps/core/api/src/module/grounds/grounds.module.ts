import { GroundsRepository, SpacesRepository } from "@cocrepo/repository";
import { GroundsService, SpacesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroundsController } from "./grounds.controller";

@Module({
	providers: [
		GroundsService,
		GroundsRepository,
		SpacesService,
		SpacesRepository,
	],
	controllers: [GroundsController],
	exports: [GroundsService],
})
export class GroundsModule {}
