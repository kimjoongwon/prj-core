import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Task } from '../entities/task.entity';

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
  Prisma.GroupCreateManyArgs,
  Task
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Task');
  }
}
