import { Module } from "@nestjs/common";
import {
	ExercisesController,
	ExercisesRepository,
	ExercisesService,
} from "@shared";

@Module({
	controllers: [ExercisesController],
	providers: [ExercisesService, ExercisesRepository],
})
export class ExercisesModule {}
