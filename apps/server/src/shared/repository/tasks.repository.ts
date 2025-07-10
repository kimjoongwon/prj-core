import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Task } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Task)
export class TasksRepository extends BaseRepository<
  Prisma.TaskCreateArgs,
  Prisma.TaskUpsertArgs,
  Prisma.TaskUpdateArgs,
  Prisma.TaskUpdateManyArgs,
  Prisma.TaskDeleteArgs,
  Prisma.TaskFindManyArgs,
  Prisma.TaskCountArgs,
  Prisma.TaskAggregateArgs,
  Prisma.TaskDeleteManyArgs,
  Prisma.TaskFindFirstArgs,
  Prisma.TaskFindUniqueArgs,
  Prisma.TaskGroupByArgs,
  Prisma.TaskCreateManyAndReturnArgs,
  Task
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Task');
  }
}
