import { Module } from '@nestjs/common';
import { GroupsController, GroupsRepository, GroupsService } from '@shared/backend';

@Module({
  providers: [GroupsService, GroupsRepository],
  controllers: [GroupsController],
})
export class GroupsModule {}
