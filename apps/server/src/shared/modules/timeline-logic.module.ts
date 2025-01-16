import { Module } from '@nestjs/common';
import { TimelineRepository } from '../repositories';
import { TimelineService } from '../services/timeline.service';

@Module({
  providers: [TimelineService, TimelineRepository],
  exports: [TimelineService],
})
export class TimelineLogicModule {}
