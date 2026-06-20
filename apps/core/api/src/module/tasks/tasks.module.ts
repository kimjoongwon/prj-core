import {
	AuthContext,
	SpaceContext,
} from "@cocrepo/context";
import { TaskAggregate } from "@cocrepo/aggregate";
import { TasksController } from "@cocrepo/controller";
import { TasksRepository } from "@cocrepo/repository";
import { TaskCommandHandlers, TaskQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [TasksController],
	providers: [
		TaskAggregate,
		TasksRepository,
		AuthContext,
		SpaceContext,
		...TaskCommandHandlers,
		...TaskQueryHandlers,
	],
})
export class TasksModule {}
