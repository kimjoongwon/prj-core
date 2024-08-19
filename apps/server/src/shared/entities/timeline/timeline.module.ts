import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineRepository } from './timeline.repository';

@Module({
  providers: [TimelineService, TimelineRepository],
  exports: [TimelineService],
})
export class TimelineModule {}
