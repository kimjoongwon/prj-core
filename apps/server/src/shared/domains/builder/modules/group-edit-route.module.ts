import { Module } from '@nestjs/common';
import { GroupEditRoute } from '../routes';

@Module({
  providers: [GroupEditRoute],
  exports: [GroupEditRoute],
})
export class GroupEditRouteModule {}
