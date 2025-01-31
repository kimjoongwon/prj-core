import { Module } from '@nestjs/common';
import { RoutineEditRoute } from '../routes/routine-edit.route';
import { RoutinesModule } from '../../../modules/routines.module';
import { ContentFormModule } from '../forms/content.form';

@Module({
  imports: [RoutinesModule, ContentFormModule],
  providers: [RoutineEditRoute],
  exports: [RoutineEditRoute],
})
export class RoutineEditRouteModule {}
