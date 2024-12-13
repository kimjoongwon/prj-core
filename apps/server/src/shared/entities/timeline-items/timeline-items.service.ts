import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTimelineItemDto, TimelineItemQueryDto, UpdateTimelineItemDto } from './dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TimelineItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTimelineItemDto: CreateTimelineItemDto) {
    return this.prisma.timelineItem.create({
      data: createTimelineItemDto,
    });
  }

  getUniqueById(id: string) {
    return this.prisma.timelineItem.findUnique({ where: { id } });
  }

  updateWithRemovedAtById(id: string, removedAt: Date) {
    return this.prisma.timelineItem.update({
      where: {
        id,
      },
      data: {
        removedAt,
      },
    });
  }

  removeManyByIds(ids: string[], removedAt: Date) {
    return this.prisma.timelineItem.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt,
      },
    });
  }

  updateDtoById(id: string, dto: UpdateTimelineItemDto) {
    return this.prisma.timelineItem.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  deleteById(id: string) {
    return this.prisma.timelineItem.delete({ where: { id } });
  }

  async getManyByQuery(query: TimelineItemQueryDto) {
    const args = query.toArgs<Prisma.TimelineItemFindManyArgs>();

    const countArgs = query.toTotalCountArgs<Prisma.TimelineItemCountArgs>();

    const totalCount = await this.prisma.timelineItem.count(countArgs);
    const timelineItems = await this.prisma.timelineItem.findMany(args);

    return {
      totalCount,
      timelineItems,
    };
  }
}
