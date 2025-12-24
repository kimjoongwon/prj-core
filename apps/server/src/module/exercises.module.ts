import { ExercisesRepository } from "@cocrepo/repository";
import { ExercisesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ExercisesController } from "@shared";

@Module({
	controllers: [ExercisesController],
	providers: [ExercisesService, ExercisesRepository],
})
export class ExercisesModule {}
