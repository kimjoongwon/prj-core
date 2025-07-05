import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Action } from '@shared/schema';

@Injectable()
@UseEntity(Action)
export class ActionsRepository extends BaseRepository<
  Prisma.ActionCreateArgs,
  Prisma.ActionUpsertArgs,
  Prisma.ActionUpdateArgs,
  Prisma.ActionUpdateManyArgs,
  Prisma.ActionDeleteArgs,
  Prisma.ActionFindManyArgs,
  Prisma.ActionCountArgs,
  Prisma.ActionAggregateArgs,
  Prisma.ActionDeleteManyArgs,
  Prisma.ActionFindFirstArgs,
  Prisma.ActionFindUniqueArgs,
  Prisma.ActionGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Action
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Action');
  }
}
