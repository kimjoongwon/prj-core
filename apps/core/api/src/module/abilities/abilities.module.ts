import {
	AbilitiesRepository,
	GrantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { AbilityApplicationService } from "@cocrepo/app";
import {
	AbilityService,
	AuthCacheService,
	AuthContext,
	SpaceContext,
	UserService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [
		AbilityApplicationService,
		AbilityService,
		UserService,
		AuthCacheService,
		AbilitiesRepository,
		GrantsRepository,
		UsersRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [AbilityApplicationService],
})
export class AbilitiesModule {}
