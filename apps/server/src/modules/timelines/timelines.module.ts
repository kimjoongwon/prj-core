import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesResolver } from './timelines.resolver';

@Module({
  providers: [TimelinesResolver, TimelinesService],
})
export class TimelinesModule {}
