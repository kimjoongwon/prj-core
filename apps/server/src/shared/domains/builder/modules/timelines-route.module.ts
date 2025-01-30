import { Module } from '@nestjs/common';
import { TimelinesRoute } from '../routes/timelines.route';

@Module({
  providers: [TimelinesRoute],
  exports: [TimelinesRoute],
})
export class TimelinesRouteModule {}
