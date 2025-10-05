import { Module } from "@nestjs/common";
import {
	ContextService,
	ExercisesController,
	ExercisesRepository,
	ExercisesService,
} from "@shared";

@Module({
	controllers: [ExercisesController],
	providers: [ExercisesService, ExercisesRepository, ContextService],
})
export class ExercisesModule {}
