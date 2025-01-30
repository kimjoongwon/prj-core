import { Module } from '@nestjs/common';
import { TimelineEditRoute } from '../routes/timeline-edit.route';

@Module({
  providers: [TimelineEditRoute],
  exports: [TimelineEditRoute],
})
export class TimelineEditRouteModule {}
