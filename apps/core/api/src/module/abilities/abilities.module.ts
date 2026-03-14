import { AbilityApplicationService } from "@cocrepo/app";
import { AbilitiesRepository, GrantsRepository } from "@cocrepo/repository";
import { AbilityService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [
		AbilityApplicationService,
		AbilityService,
		AbilitiesRepository,
		GrantsRepository,
	],
	exports: [AbilityApplicationService],
})
export class AbilitiesModule {}
