import { TasksApplicationService } from "@cocrepo/app";
import { TasksRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext, TasksService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";

@Module({
	controllers: [TasksController],
	providers: [
		TasksApplicationService,
		TasksService,
		TasksRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [TasksApplicationService],
})
export class TasksModule {}
