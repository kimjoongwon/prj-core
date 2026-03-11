import { GrantsApplicationService } from "@cocrepo/app";
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
		GrantsApplicationService,
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
	exports: [GrantsApplicationService],
})
export class GrantsModule {}
