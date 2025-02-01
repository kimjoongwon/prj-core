import { Global, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Depot } from '../entities/depot.entity';

@Injectable()
@UseEntity(Depot)
export class DepotsRepository extends BaseRepository<
  Prisma.DepotCreateArgs,
  Prisma.DepotUpsertArgs,
  Prisma.DepotUpdateArgs,
  Prisma.DepotUpdateManyArgs,
  Prisma.DepotDeleteArgs,
  Prisma.DepotFindManyArgs,
  Prisma.DepotCountArgs,
  Prisma.DepotAggregateArgs,
  Prisma.DepotDeleteManyArgs,
  Prisma.DepotFindFirstArgs,
  Prisma.DepotFindUniqueArgs,
  Prisma.DepotGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Depot
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Depot');
  }
}
