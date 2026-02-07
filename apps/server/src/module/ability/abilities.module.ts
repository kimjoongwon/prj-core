import { SpaceContext } from "@cocrepo/be-common";
import { AbilitiesFacade } from "@cocrepo/facade";
import {
	AbilitiesRepository,
	GrantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { AbilitiesService, UsersService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [
		// Facade
		AbilitiesFacade,
		// Services
		AbilitiesService,
		UsersService,
		// Repositories
		AbilitiesRepository,
		GrantsRepository,
		UsersRepository,
		// Context
		SpaceContext,
	],
	exports: [AbilitiesService],
})
export class AbilitiesModule {}
