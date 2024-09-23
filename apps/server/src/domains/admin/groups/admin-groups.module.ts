import { Module } from '@nestjs/common';
import { GroupsController, GroupsModule } from '@shared';
import { AdminGroupsService } from './admin-groups.service';
import { AdminGroupsController } from './admin-groups.controller';

@Module({
  imports: [GroupsModule],
  providers: [AdminGroupsService],
  controllers: [GroupsController, AdminGroupsController],
})
export class AdminGroupsModule {}
