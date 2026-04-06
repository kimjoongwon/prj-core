import { RoleGrantFacade } from "@cocrepo/facade";
import {
	AbilitiesRepository,
	RolesRepository,
	RoleGrantsRepository,
} from "@cocrepo/repository";
import { RoleGrantService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GrantsController } from "./grants.controller";

@Module({
	controllers: [GrantsController],
	providers: [
		RoleGrantFacade,
		RoleGrantService,
		RoleGrantsRepository,
		RolesRepository,
		AbilitiesRepository,
		SpaceContext,
	],
	exports: [RoleGrantFacade],
})
export class GrantsModule {}
