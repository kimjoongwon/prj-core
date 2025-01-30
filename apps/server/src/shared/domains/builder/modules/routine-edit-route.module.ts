import { Module } from '@nestjs/common';
import { RoutineEditRoute } from '../routes/routine-edit.route';
import { RoutinesModule } from '../../../modules/routines.module';

@Module({
  imports: [RoutinesModule],
  providers: [RoutineEditRoute],
  exports: [RoutineEditRoute],
})
export class RoutineEditRouteModule {}
