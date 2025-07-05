import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { RoleAssociation } from '../entity/role-association.entity';

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
