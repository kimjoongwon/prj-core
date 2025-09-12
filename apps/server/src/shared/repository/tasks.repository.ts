import { Injectable } from "@nestjs/common";
import { Prisma, Task } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";

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
		super(prisma, "Task");
	}
}
