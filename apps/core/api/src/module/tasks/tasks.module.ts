import { TaskAggregateRoot } from "@cocrepo/aggregate";
import { TasksRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { TaskCommandHandlers, TaskQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TasksController } from "./tasks.controller";

@Module({
	imports: [CqrsModule],
	controllers: [TasksController],
	providers: [
		TaskAggregateRoot,
		TasksRepository,
		AuthContext,
		SpaceContext,
		...TaskCommandHandlers,
		...TaskQueryHandlers,
	],
})
export class TasksModule {}
