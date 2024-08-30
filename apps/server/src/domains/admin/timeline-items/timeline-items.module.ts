import { Module } from '@nestjs/common';
import { TimelineItemController, TimelineItemModule } from '@shared';
import { TimelineItemsController } from './timeline-items.controller';

@Module({
  controllers: [TimelineItemsController, TimelineItemController],
  imports: [TimelineItemModule],
})
export class TimelineItemsModule {}
