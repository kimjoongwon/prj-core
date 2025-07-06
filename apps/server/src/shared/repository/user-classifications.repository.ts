import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { UserClassification } from '@shared/schema';

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
