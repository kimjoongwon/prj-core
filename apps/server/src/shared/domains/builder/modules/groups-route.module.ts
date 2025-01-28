import { Module } from '@nestjs/common';
import { GroupsRoute } from '../routes';

@Module({
  providers: [GroupsRoute],
  exports: [GroupsRoute],
})
export class GroupsRouteModule {}
