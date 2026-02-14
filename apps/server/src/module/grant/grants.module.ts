import {
	AbilitiesRepository,
	GrantsRepository,
	RolesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { GrantsService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GrantsController } from "./grants.controller";

@Module({
	controllers: [GrantsController],
	providers: [
		// Services
		GrantsService,
		// Repositories
		GrantsRepository,
		RolesRepository,
		UsersRepository,
		AbilitiesRepository,
		// Context
		SpaceContext,
	],
	exports: [GrantsService],
})
export class GrantsModule { }
