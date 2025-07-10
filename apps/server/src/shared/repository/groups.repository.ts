import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Group } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
  Prisma.GroupCreateManyAndReturnArgs,
  Group
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Group');
  }
}
