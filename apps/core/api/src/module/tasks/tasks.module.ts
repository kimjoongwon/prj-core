import { TaskAggregate } from "@cocrepo/aggregate";
import { TasksRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { TaskCommandHandlers, TaskQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TasksController } from "@cocrepo/controller";

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
