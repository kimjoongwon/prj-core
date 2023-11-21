import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesResolver } from './timelines.resolver';
import { TimelineItemsModule } from '../timelineItems/timelineItems.module';

@Module({
  imports: [TimelineItemsModule],
  providers: [TimelinesResolver, TimelinesService],
})
export class TimelinesModule {}
