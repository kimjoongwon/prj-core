import { AbilityApplicationService } from "@cocrepo/app";
import {
	AbilitiesRepository,
	RoleGrantsRepository,
	UserGrantsRepository,
} from "@cocrepo/repository";
import { AbilityService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [
		AbilityApplicationService,
		AbilityService,
		AbilitiesRepository,
		RoleGrantsRepository,
		UserGrantsRepository,
	],
	exports: [AbilityApplicationService],
})
export class AbilitiesModule {}
