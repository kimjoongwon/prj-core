import { RoutinesRepository } from "@cocrepo/repository";
import { RoutinesService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoutinesController } from "./routines.controller";

@Module({
	controllers: [RoutinesController],
	providers: [
		// Service
		RoutinesService,
		// Repository
		RoutinesRepository,
		// Context
		SpaceContext,
	],
	exports: [RoutinesService],
})
export class RoutinesModule {}
