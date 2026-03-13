import { GroupFacade } from "@cocrepo/facade";
import { GroupsRepository } from "@cocrepo/repository";
import { GroupService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroupsController } from "./groups.controller";

@Module({
	controllers: [GroupsController],
	providers: [
		GroupFacade,
		GroupService,
		GroupsRepository,
		SpaceContext,
	],
	exports: [GroupFacade],
})
export class GroupsModule {}
