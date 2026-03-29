import { RoutineFacade } from "@cocrepo/facade";
import { RoutinesRepository, TasksRepository } from "@cocrepo/repository";
import { AuthContext, RoutineService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoutinesController } from "./routines.controller";

@Module({
	controllers: [RoutinesController],
	providers: [
		RoutineFacade,
		RoutineService,
		RoutinesRepository,
		TasksRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [RoutineFacade],
})
export class RoutinesModule {}
