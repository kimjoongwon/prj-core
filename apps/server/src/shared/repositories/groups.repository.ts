import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Group } from '../entities/group.entity';

@Injectable()
@UseEntity(Group)
export class GroupsRepository extends BaseRepository<
  Prisma.GroupCreateArgs,
  Prisma.GroupUpsertArgs,
  Prisma.GroupUpdateArgs,
  Prisma.GroupUpdateManyArgs,
  Prisma.GroupDeleteArgs,
  Prisma.GroupFindManyArgs,
  Prisma.GroupCountArgs,
  Prisma.GroupAggregateArgs,
  Prisma.GroupDeleteManyArgs,
  Prisma.GroupFindFirstArgs,
  Prisma.GroupFindUniqueArgs,
  Prisma.GroupGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Group
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Group');
  }
}
