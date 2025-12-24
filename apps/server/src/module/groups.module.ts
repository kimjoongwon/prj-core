import { GroupsRepository } from "@cocrepo/repository";
import { GroupsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroupsController } from "@shared";

@Module({
	controllers: [GroupsController],
	providers: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
