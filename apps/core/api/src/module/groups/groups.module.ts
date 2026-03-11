import { GroupsApplicationService } from "@cocrepo/app";
import { GroupsRepository } from "@cocrepo/repository";
import { GroupsService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroupsController } from "./groups.controller";

@Module({
	controllers: [GroupsController],
	providers: [
		GroupsApplicationService,
		GroupsService,
		GroupsRepository,
		SpaceContext,
	],
	exports: [GroupsApplicationService],
})
export class GroupsModule {}
