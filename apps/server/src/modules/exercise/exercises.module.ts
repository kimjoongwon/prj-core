import { Module } from '@nestjs/common';
import { ExercisesController } from '../../shared';

@Module({
  controllers: [ExercisesController],
})
export class ExercisesModule {}
