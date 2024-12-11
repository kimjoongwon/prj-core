import { Injectable } from '@nestjs/common';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { TimelineItemsRepository } from './timeline-items.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class TimelineItemsService {
  constructor(private readonly repository: TimelineItemsRepository) {}

  upsert(id: string, createTimelineItemDto: CreateTimelineItemDto) {
    return this.repository.upsert({
      where: { id },
      create: createTimelineItemDto,
      update: createTimelineItemDto,
    });
  }

  create(args: Prisma.TimelineItemCreateArgs) {
    return this.repository.create(args);
  }

  update(args: Prisma.TimelineItemUpdateArgs) {
    return this.repository.update(args);
  }

  getUnique(args: Prisma.TimelineItemFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.TimelineItemFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  remove(args: Prisma.TimelineItemUpdateArgs) {
    return this.repository.update(args);
  }

  removeMany(args: Prisma.TimelineItemUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  delete(args: Prisma.TimelineItemDeleteArgs) {
    return this.repository.delete(args);
  }

  async getManyByQuery(args: Prisma.TimelineItemFindManyArgs) {
    const timelineItemCount = await this.repository.count(args as Prisma.TimelineItemCountArgs);
    const timelineItems = await this.repository.findMany(args);
    return {
      count: timelineItemCount,
      timelineItems,
    };
  }
}
