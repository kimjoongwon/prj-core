import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Timeline } from '../entities/timeline.entity';

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
  Prisma.GroupCreateManyArgs,
  Timeline
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Timeline');
  }
}
