import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Timeline } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Timeline)
export class TimelinesRepository extends BaseRepository<
  Prisma.TimelineCreateArgs,
  Prisma.TimelineUpsertArgs,
  Prisma.TimelineUpdateArgs,
  Prisma.TimelineUpdateManyArgs,
  Prisma.TimelineDeleteArgs,
  Prisma.TimelineFindManyArgs,
  Prisma.TimelineCountArgs,
  Prisma.TimelineAggregateArgs,
  Prisma.TimelineDeleteManyArgs,
  Prisma.TimelineFindFirstArgs,
  Prisma.TimelineFindUniqueArgs,
  Prisma.TimelineGroupByArgs,
  Prisma.TimelineCreateManyAndReturnArgs,
  Timeline
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Timeline');
  }
}
