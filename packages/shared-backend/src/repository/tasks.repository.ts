import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Task } from '@shared/schema';

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
