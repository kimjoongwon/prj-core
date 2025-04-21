import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Ground } from '../entities';

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
