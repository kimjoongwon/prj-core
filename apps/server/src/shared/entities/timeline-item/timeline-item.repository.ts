import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimelineItemRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.TimelineItemCreateArgs) {
    return this.prisma.timelineItem.create(args);
  }

  upsert(args: Prisma.TimelineItemUpsertArgs) {
    return this.prisma.timelineItem.upsert(args);
  }

  update(args: Prisma.TimelineItemUpdateArgs) {
    return this.prisma.timelineItem.update(args);
  }

  updateMany(args: Prisma.TimelineItemUpdateManyArgs) {
    return this.prisma.timelineItem.updateMany(args);
  }

  delete(args: Prisma.TimelineItemDeleteArgs) {
    return this.prisma.timelineItem.delete(args);
  }

  findMany(args: Prisma.TimelineItemFindManyArgs) {
    return this.prisma.timelineItem.findMany({
      ...args,
      where: {
        removedAt: null,
        ...args.where,
      },
      orderBy: {
        createdAt: 'desc',
        ...args.orderBy,
      },
    });
  }

  findUnique(args: Prisma.TimelineItemFindUniqueArgs) {
    return this.prisma.timelineItem.findUnique(args);
  }

  findFirst(args: Prisma.TimelineItemFindFirstArgs) {
    return this.prisma.timelineItem.findFirst(args);
  }

  count(args: Prisma.TimelineItemCountArgs) {
    return this.prisma.timelineItem.count(args);
  }
}
