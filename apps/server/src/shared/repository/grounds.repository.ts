import { Injectable } from '@nestjs/common';
import { Ground, Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Ground)
export class GroundsRepository extends BaseRepository<
  Prisma.GroundCreateArgs,
  Prisma.GroundUpsertArgs,
  Prisma.GroundUpdateArgs,
  Prisma.GroundUpdateManyArgs,
  Prisma.GroundDeleteArgs,
  Prisma.GroundFindManyArgs,
  Prisma.GroundCountArgs,
  Prisma.GroundAggregateArgs,
  Prisma.GroundDeleteManyArgs,
  Prisma.GroundFindFirstArgs,
  Prisma.GroundFindUniqueArgs,
  Prisma.GroundGroupByArgs,
  Prisma.GroundCreateManyArgs,
  Ground
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Ground');
  }
}
