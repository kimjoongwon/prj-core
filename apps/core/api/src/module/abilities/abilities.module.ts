import { AbilitiesApplicationService } from "@cocrepo/app";
import {
	AbilitiesRepository,
	GrantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AbilitiesService,
	AuthCacheService,
	AuthContext,
	SpaceContext,
	UsersService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [
		AbilitiesApplicationService,
		// Services
		AbilitiesService,
		UsersService,
		AuthCacheService,
		// Repositories
		AbilitiesRepository,
		GrantsRepository,
		UsersRepository,
		// Context
		AuthContext,
		SpaceContext,
	],
	exports: [AbilitiesApplicationService],
})
export class AbilitiesModule {}
