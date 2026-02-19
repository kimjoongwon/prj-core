import { ExercisesRepository } from "@cocrepo/repository";
import { ExercisesService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ExercisesController } from "./exercises.controller";

@Module({
	controllers: [ExercisesController],
	providers: [
		// Service
		ExercisesService,
		// Repository
		ExercisesRepository,
		// Context
		SpaceContext,
	],
	exports: [ExercisesService],
})
export class ExercisesModule {}
