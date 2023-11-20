import { Module } from '@nestjs/common';
import { TimelineItemsService } from './timelineItems.service';
import { TimelineItemsResolver } from './timelineItems.resolver';

@Module({
  providers: [TimelineItemsResolver, TimelineItemsService],
})
export class TimelineItemsModule {}
