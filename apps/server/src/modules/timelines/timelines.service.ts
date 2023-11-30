import { Injectable } from '@nestjs/common';
import { cloneDeep, last } from 'lodash';
import { queryBuilder } from '../../common/utils';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateTimelineInput } from './dto/create-timeline.input';
import { GetTimelinesArgs } from './dto/get-timelines.args';
import { UpdateTimelineInput } from './dto/update-timeline.input';
import { PaginatedTimeline } from './models/paginated-timeline.model';
import {
  TimelineForm,
  defaultTimelineForm,
} from './models/timeline-form.model';
import { GetTimelineFormArgs } from './dto/get-timeline-form.args';

@Injectable()
export class TimelinesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTimelineInput: CreateTimelineInput) {
    return this.prisma.timeline.create({
      data: createTimelineInput,
    });
  }

  async findForm(args: GetTimelineFormArgs): Promise<TimelineForm> {
    const { sessionId, timelineId } = args;
    const timelineForm = cloneDeep(defaultTimelineForm);

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    timelineForm.session = session;

    if (timelineId === 'new') {
      return timelineForm;
    }

    const timeline = await this.prisma.timeline.findUnique({
      where: { id: timelineId },
    });

    return {
      ...timelineForm,
      ...timeline,
    };
  }

  async findPaginatedTimeline(
    args: GetTimelinesArgs,
  ): Promise<PaginatedTimeline> {
    const query = queryBuilder(args);

    const timelines = await this.prisma.timeline.findMany({
      ...query,
    });

    const totalCount = await this.prisma.timeline.count({
      where: query?.where,
    });

    const endCursor = last(timelines)?.id;

    return {
      edges: timelines.map(timeline => ({ node: timeline })),
      nodes: timelines,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(timelines.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.timeline.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.timeline.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateTimelineInput) {
    return this.prisma.timeline.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
