import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Classification } from '../entity/classification.entity';

@Injectable()
@UseEntity(Classification)
export class ClassificationsRepository extends BaseRepository<
  Prisma.ClassificationCreateArgs,
  Prisma.ClassificationUpsertArgs,
  Prisma.ClassificationUpdateArgs,
  Prisma.ClassificationUpdateManyArgs,
  Prisma.ClassificationDeleteArgs,
  Prisma.ClassificationFindManyArgs,
  Prisma.ClassificationCountArgs,
  Prisma.ClassificationAggregateArgs,
  Prisma.ClassificationDeleteManyArgs,
  Prisma.ClassificationFindFirstArgs,
  Prisma.ClassificationFindUniqueArgs,
  Prisma.ClassificationGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Classification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Classification');
  }
}
