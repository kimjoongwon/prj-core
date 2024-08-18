import { Module } from '@nestjs/common';
import { TimelineItemsService } from './timeline-items.service';
import { TimelineItemsController } from './timeline-items.controller';

@Module({
  controllers: [TimelineItemsController],
  providers: [TimelineItemsService],
})
export class TimelineItemsModule {}
