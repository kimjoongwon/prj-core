import { Injectable } from '@nestjs/common';
import { IService } from '../../types/interfaces/service.interface';
import { PaginationMananger } from '../../utils';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { TimelineItemRepository } from './timeline-item.repository';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';
import { TimelineItemQueryDto } from './dto/timeline-item-query.dto';

@Injectable()
export class TimelineItemService implements IService {
  constructor(private readonly repository: TimelineItemRepository) {}

  create(createTimelineItemDto: CreateTimelineItemDto) {
    return this.repository.create({ data: { ...createTimelineItemDto } });
  }

  update(timelineItemId: string, updateTimelineItemDto: UpdateTimelineItemDto) {
    return this.repository.update({
      where: { id: timelineItemId },
      data: updateTimelineItemDto,
    });
  }

  getUnique(timelineItemId: string) {
    return this.repository.findUnique({ where: { id: timelineItemId } });
  }

  getFirst(timelineItemId: string) {
    return this.repository.findFirst({
      where: { id: timelineItemId },
    });
  }

  remove(timelineItemId: string) {
    return this.repository.update({
      where: { id: timelineItemId },
      data: { removedAt: new Date() },
    });
  }

  removeMany(timelineItemIds: string[]) {
    return this.repository.updateMany({
      where: { id: { in: timelineItemIds } },
      data: { removedAt: new Date() },
    });
  }

  delete(timelineItemId: string) {
    return this.repository.delete({ where: { id: timelineItemId } });
  }

  async getManyByQuery(query: TimelineItemQueryDto) {
    const args = PaginationMananger.toArgs(query);
    console.log(args);
    const timelineItemCount = await this.repository.count(args);
    const timelineItems = await this.repository.findMany(args);
    return {
      count: timelineItemCount,
      timelineItems,
    };
  }
}
