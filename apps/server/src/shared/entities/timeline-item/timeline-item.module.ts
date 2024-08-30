import { Module } from '@nestjs/common';
import { TimelineItemService } from './timeline-item.service';
import { TimelineItemController } from './timeline-item.controller';
import { TimelineItemRepository } from './timeline-item.repository';

@Module({
  controllers: [TimelineItemController],
  providers: [TimelineItemService, TimelineItemRepository],
  exports: [TimelineItemService],
})
export class TimelineItemModule {}
