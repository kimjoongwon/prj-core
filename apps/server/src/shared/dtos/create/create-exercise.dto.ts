import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { ExerciseDto } from '../exercise.dto';
import { ClassField } from '../../decorators';
import { CreateTaskDto } from './create-task.dto';

export class CreateExerciseDto extends OmitType(ExerciseDto, [
  ...COMMON_ENTITY_FIELDS,
  'taskId',
  'task',
]) {
  @ClassField(() => CreateTaskDto)
  task: CreateTaskDto;
}
