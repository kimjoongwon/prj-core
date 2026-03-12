import {
	AbilitiesRepository,
	GrantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { AbilitiesApplicationService } from "@cocrepo/app";
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
		AbilitiesService,
		UsersService,
		AuthCacheService,
		AbilitiesRepository,
		GrantsRepository,
		UsersRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [AbilitiesApplicationService],
})
export class AbilitiesModule {}
