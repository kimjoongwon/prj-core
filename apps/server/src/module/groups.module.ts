import { Module } from "@nestjs/common";
import { GroupsController, GroupsRepository, GroupsService } from "@shared";

@Module({
	controllers: [GroupsController],
	providers: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
