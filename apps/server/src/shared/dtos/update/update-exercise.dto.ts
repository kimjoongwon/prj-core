import { PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from '../create/create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
