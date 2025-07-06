import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { UserAssociation } from '@shared/schema';

@Injectable()
@UseEntity(UserAssociation)
export class UserAssociationsRepository extends BaseRepository<
  Prisma.UserAssociationCreateArgs,
  Prisma.UserAssociationUpsertArgs,
  Prisma.UserAssociationUpdateArgs,
  Prisma.UserAssociationUpdateManyArgs,
  Prisma.UserAssociationDeleteArgs,
  Prisma.UserAssociationFindManyArgs,
  Prisma.UserAssociationCountArgs,
  Prisma.UserAssociationAggregateArgs,
  Prisma.UserAssociationDeleteManyArgs,
  Prisma.UserAssociationFindFirstArgs,
  Prisma.UserAssociationFindUniqueArgs,
  Prisma.UserAssociationGroupByArgs,
  Prisma.UserAssociationCreateManyArgs,
  UserAssociation
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'UserAssociation');
  }
}
