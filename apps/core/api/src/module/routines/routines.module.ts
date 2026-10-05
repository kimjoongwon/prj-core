import { RoutineAggregate } from "@cocrepo/aggregate";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { RoutinesController } from "@cocrepo/controller";
import { RoutinesRepository, TasksRepository } from "@cocrepo/repository";
import { RoutineCommandHandlers, RoutineQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [RoutinesController],
	providers: [
		RoutineAggregate,
		RoutinesRepository,
		TasksRepository,
		AuthContext,
		SpaceContext,
		...RoutineCommandHandlers,
		...RoutineQueryHandlers,
	],
})
export class RoutinesModule {}
