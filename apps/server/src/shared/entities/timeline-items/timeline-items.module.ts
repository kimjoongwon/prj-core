import { Module } from '@nestjs/common';
import { TimelineItemsService } from './timeline-items.service';
import { TimelineItemsController } from './timeline-items.controller';
import { TimelineItemsRepository } from './timeline-items.repository';

@Module({
  controllers: [TimelineItemsController],
  providers: [TimelineItemsService, TimelineItemsRepository],
  exports: [TimelineItemsService],
})
export class TimelineItemsModule {}
