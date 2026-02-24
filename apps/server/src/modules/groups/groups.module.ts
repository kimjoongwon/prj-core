import { SpaceContext } from "@cocrepo/service";
import { GroupsRepository } from "@cocrepo/repository";
import { GroupsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroupsController } from "./groups.controller";

@Module({
	controllers: [GroupsController],
	providers: [GroupsService, GroupsRepository, SpaceContext],
	exports: [GroupsService],
})
export class GroupsModule {}
