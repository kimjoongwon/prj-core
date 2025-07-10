import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { SpaceClassification } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(SpaceClassification)
export class SpaceClassificationsRepository extends BaseRepository<
  Prisma.SpaceClassificationCreateArgs,
  Prisma.SpaceClassificationUpsertArgs,
  Prisma.SpaceClassificationUpdateArgs,
  Prisma.SpaceClassificationUpdateManyArgs,
  Prisma.SpaceClassificationDeleteArgs,
  Prisma.SpaceClassificationFindManyArgs,
  Prisma.SpaceClassificationCountArgs,
  Prisma.SpaceClassificationAggregateArgs,
  Prisma.SpaceClassificationDeleteManyArgs,
  Prisma.SpaceClassificationFindFirstArgs,
  Prisma.SpaceClassificationFindUniqueArgs,
  Prisma.SpaceClassificationGroupByArgs,
  Prisma.SpaceClassificationCreateManyArgs,
  SpaceClassification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'SpaceClassification');
  }
}
