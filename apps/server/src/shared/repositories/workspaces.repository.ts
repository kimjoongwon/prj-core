import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Workspace } from '../entities';

@Injectable()
@UseEntity(Workspace)
export class WorkspacesRepository extends BaseRepository<
  Prisma.WorkspaceCreateArgs,
  Prisma.WorkspaceUpsertArgs,
  Prisma.WorkspaceUpdateArgs,
  Prisma.WorkspaceUpdateManyArgs,
  Prisma.WorkspaceDeleteArgs,
  Prisma.WorkspaceFindManyArgs,
  Prisma.WorkspaceCountArgs,
  Prisma.WorkspaceAggregateArgs,
  Prisma.WorkspaceDeleteManyArgs,
  Prisma.WorkspaceFindFirstArgs,
  Prisma.WorkspaceFindUniqueArgs,
  Prisma.WorkspaceGroupByArgs,
  Prisma.WorkspaceCreateManyArgs,
  Workspace
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Workspace');
  }
}
