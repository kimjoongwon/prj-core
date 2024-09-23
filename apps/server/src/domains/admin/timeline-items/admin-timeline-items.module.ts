import { Module } from '@nestjs/common';
import { TimelineItemsController, TimelineItemsModule } from '@shared';
import { AdminTimelineItemsController } from './admin-timeline-items.controller';

@Module({
  imports: [TimelineItemsModule],
  controllers: [TimelineItemsController, AdminTimelineItemsController],
})
export class AdminTimelineItemsModule {}
