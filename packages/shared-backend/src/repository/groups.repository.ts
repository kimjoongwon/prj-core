import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Group } from '@shared/schema';

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
