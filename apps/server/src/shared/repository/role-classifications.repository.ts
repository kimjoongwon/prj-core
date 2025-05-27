import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { RoleClassification } from '../entity/role-classification.entity';

@Injectable()
@UseEntity(RoleClassification)
export class RoleClassificationsRepository extends BaseRepository<
  Prisma.RoleClassificationCreateArgs,
  Prisma.RoleClassificationUpsertArgs,
  Prisma.RoleClassificationUpdateArgs,
  Prisma.RoleClassificationUpdateManyArgs,
  Prisma.RoleClassificationDeleteArgs,
  Prisma.RoleClassificationFindManyArgs,
  Prisma.RoleClassificationCountArgs,
  Prisma.RoleClassificationAggregateArgs,
  Prisma.RoleClassificationDeleteManyArgs,
  Prisma.RoleClassificationFindFirstArgs,
  Prisma.RoleClassificationFindUniqueArgs,
  Prisma.RoleClassificationGroupByArgs,
  Prisma.RoleClassificationCreateManyArgs,
  RoleClassification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'RoleClassification');
  }
}
