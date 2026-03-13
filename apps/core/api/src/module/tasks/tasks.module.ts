import { TaskFacade } from "@cocrepo/facade";
import { TasksRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext, TaskService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";

@Module({
	controllers: [TasksController],
	providers: [
		TaskFacade,
		TaskService,
		TasksRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [TaskFacade],
})
export class TasksModule {}
