import { Module } from '@nestjs/common';
import { TimelineItemService } from './timeline-item.service';
import { TimelineItemController } from './timeline-item.controller';

@Module({
  controllers: [TimelineItemController],
  providers: [TimelineItemService],
})
export class TimelineItemModule {}
