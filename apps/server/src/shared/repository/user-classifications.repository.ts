import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { UserClassification } from '../entity/user-classification.entity';

@Injectable()
@UseEntity(UserClassification)
export class UserClassificationsRepository extends BaseRepository<
  Prisma.UserClassificationCreateArgs,
  Prisma.UserClassificationUpsertArgs,
  Prisma.UserClassificationUpdateArgs,
  Prisma.UserClassificationUpdateManyArgs,
  Prisma.UserClassificationDeleteArgs,
  Prisma.UserClassificationFindManyArgs,
  Prisma.UserClassificationCountArgs,
  Prisma.UserClassificationAggregateArgs,
  Prisma.UserClassificationDeleteManyArgs,
  Prisma.UserClassificationFindFirstArgs,
  Prisma.UserClassificationFindUniqueArgs,
  Prisma.UserClassificationGroupByArgs,
  Prisma.GroupCreateManyArgs,
  UserClassification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'UserClassification');
  }
}
