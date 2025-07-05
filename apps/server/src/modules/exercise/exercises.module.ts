import { Module } from '@nestjs/common';
import { ExercisesController } from '@shared/backend';

@Module({
  controllers: [ExercisesController],
})
export class ExercisesModule {}
