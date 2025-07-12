import { Injectable } from '@nestjs/common';
import { Prisma, UserClassification } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
  Prisma.UserClassificationCreateManyAndReturnArgs,
  UserClassification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'UserClassification');
  }
}
