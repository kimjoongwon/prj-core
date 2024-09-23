import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesRepository } from './timelines.repository';

@Module({
  providers: [TimelinesService, TimelinesRepository],
  exports: [TimelinesService],
})
export class TimelinesModule {}
