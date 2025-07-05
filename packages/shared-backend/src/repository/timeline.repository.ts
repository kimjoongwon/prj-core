import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Timeline } from '@shared/schema';

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
