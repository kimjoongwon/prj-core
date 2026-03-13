import { GrantFacade } from "@cocrepo/facade";
import {
	AbilitiesRepository,
	GrantsRepository,
	RolesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { GrantService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GrantsController } from "./grants.controller";

@Module({
	controllers: [GrantsController],
	providers: [
		GrantFacade,
		GrantService,
		GrantsRepository,
		RolesRepository,
		UsersRepository,
		AbilitiesRepository,
		SpaceContext,
	],
	exports: [GrantFacade],
})
export class GrantsModule {}
