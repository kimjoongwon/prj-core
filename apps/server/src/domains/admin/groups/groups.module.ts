import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsRepository, GroupsService } from '@shared';

@Module({
  controllers: [GroupsController],
  providers: [GroupsRepository, GroupsService],
})
export class GroupsModule {}
