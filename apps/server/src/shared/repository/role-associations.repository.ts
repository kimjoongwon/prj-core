import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { RoleAssociation } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(RoleAssociation)
export class RoleAssociationsRepository extends BaseRepository<
  Prisma.RoleAssociationCreateArgs,
  Prisma.RoleAssociationUpsertArgs,
  Prisma.RoleAssociationUpdateArgs,
  Prisma.RoleAssociationUpdateManyArgs,
  Prisma.RoleAssociationDeleteArgs,
  Prisma.RoleAssociationFindManyArgs,
  Prisma.RoleAssociationCountArgs,
  Prisma.RoleAssociationAggregateArgs,
  Prisma.RoleAssociationDeleteManyArgs,
  Prisma.RoleAssociationFindFirstArgs,
  Prisma.RoleAssociationFindUniqueArgs,
  Prisma.RoleAssociationGroupByArgs,
  Prisma.RoleAssociationCreateManyArgs,
  RoleAssociation
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'RoleAssociation');
  }
}
