import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils/query-builder';
import { CreateTimelineItemInput } from './dto/create-timelineItem.input';
import { GetTimelineItemsArgs } from './dto/get-timelineItems.args';
import { UpdateTimelineItemInput } from './dto/update-timelineItem.input';
import { TimelineItemForm } from './models/timelineItem-form.model';
import { PaginatedTimelineItem } from './models/paginated-timelineItem.model';

@Injectable()
export class TimelineItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTimelineItemInput: CreateTimelineItemInput) {
    return this.prisma.timelineItem.create({
      data: createTimelineItemInput,
    });
  }

  findForm(): TimelineItemForm {
    return {
      address: '',
      description: '',
      title: '',
      timelineId: '',
    };
  }

  async findPaginatedTimelineItem(
    args: GetTimelineItemsArgs,
  ): Promise<PaginatedTimelineItem> {
    const query = queryBuilder(args, []);

    const timelineItems = await this.prisma.timelineItem.findMany({
      ...query,
    });

    const totalCount = await this.prisma.timelineItem.count({
      where: query?.where,
    });

    const endCursor = last(timelineItems)?.id;

    return {
      edges: timelineItems.map(timelineItem => ({ node: timelineItem })),
      nodes: timelineItems,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(timelineItems.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.timelineItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.timelineItem.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateTimelineItemInput) {
    return this.prisma.timelineItem.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
