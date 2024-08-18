import { Injectable } from '@nestjs/common';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';

@Injectable()
export class TimelineItemService {
  create(createTimelineItemDto: CreateTimelineItemDto) {
    return 'This action adds a new timelineItem';
  }

  findAll() {
    return `This action returns all timelineItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timelineItem`;
  }

  update(id: number, updateTimelineItemDto: UpdateTimelineItemDto) {
    return `This action updates a #${id} timelineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} timelineItem`;
  }
}
