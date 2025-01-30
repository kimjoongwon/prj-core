import { Module } from '@nestjs/common';
import { RoutinesRoute } from '../routes/routines.route';
import { RoutineColumns } from '../columns';

@Module({
  providers: [RoutinesRoute, RoutineColumns],
  exports: [RoutinesRoute],
})
export class RoutinesRouteModule {}
