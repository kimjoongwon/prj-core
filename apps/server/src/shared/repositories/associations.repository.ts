import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Association } from '../entities/association.entity';

@Injectable()
@UseEntity(Association)
export class AssociationsRepository extends BaseRepository<
  Prisma.AssociationCreateArgs,
  Prisma.AssociationUpsertArgs,
  Prisma.AssociationUpdateArgs,
  Prisma.AssociationUpdateManyArgs,
  Prisma.AssociationDeleteArgs,
  Prisma.AssociationFindManyArgs,
  Prisma.AssociationCountArgs,
  Prisma.AssociationAggregateArgs,
  Prisma.AssociationDeleteManyArgs,
  Prisma.AssociationFindFirstArgs,
  Prisma.AssociationFindUniqueArgs,
  Prisma.AssociationGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Association
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Association');
  }
}
