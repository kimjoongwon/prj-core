import { Module } from '@nestjs/common';
import { GroupsController, GroupsRepository, GroupsService } from '@shared';

@Module({
  providers: [GroupsService, GroupsRepository],
  controllers: [GroupsController],
})
export class GroupsEndpointModule {}
