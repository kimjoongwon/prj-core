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
		GrantsService,
		GrantsRepository,
		RolesRepository,
		UsersRepository,
		AbilitiesRepository,
		SpaceContext,
	],
	exports: [GrantsApplicationService],
})
export class GrantsModule {}
