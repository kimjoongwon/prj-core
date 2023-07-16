import { Module } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { UserGroupsResolver } from './user-groups.resolver';

@Module({
  providers: [UserGroupsResolver, UserGroupsService],
})
export class UserGroupsModule {}
