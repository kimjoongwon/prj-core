import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { SpaceClassification } from '../entity/space-classification.entity';

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
