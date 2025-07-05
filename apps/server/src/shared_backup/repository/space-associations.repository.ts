import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { SpaceAssociation } from '../entity/space-association.entity';

@Injectable()
@UseEntity(SpaceAssociation)
export class SpaceAssociationsRepository extends BaseRepository<
  Prisma.SpaceAssociationCreateArgs,
  Prisma.SpaceAssociationUpsertArgs,
  Prisma.SpaceAssociationUpdateArgs,
  Prisma.SpaceAssociationUpdateManyArgs,
  Prisma.SpaceAssociationDeleteArgs,
  Prisma.SpaceAssociationFindManyArgs,
  Prisma.SpaceAssociationCountArgs,
  Prisma.SpaceAssociationAggregateArgs,
  Prisma.SpaceAssociationDeleteManyArgs,
  Prisma.SpaceAssociationFindFirstArgs,
  Prisma.SpaceAssociationFindUniqueArgs,
  Prisma.SpaceAssociationGroupByArgs,
  Prisma.SpaceAssociationCreateManyArgs,
  SpaceAssociation
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'SpaceAssociation');
  }
}
