import { AbilitiesRepository } from "@cocrepo/repository";
import { AbilitiesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	providers: [AbilitiesService, AbilitiesRepository],
	controllers: [AbilitiesController],
	exports: [AbilitiesService],
})
export class AbilitiesModule {}
