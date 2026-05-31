import { RoutineAggregateRoot } from "@cocrepo/aggregate";
import { RoutinesRepository, TasksRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { RoutineCommandHandlers, RoutineQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RoutinesController } from "./routines.controller";

@Module({
	imports: [CqrsModule],
	controllers: [RoutinesController],
	providers: [
		RoutineAggregateRoot,
		RoutinesRepository,
		TasksRepository,
		AuthContext,
		SpaceContext,
		...RoutineCommandHandlers,
		...RoutineQueryHandlers,
	],
})
export class RoutinesModule {}
