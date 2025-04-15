import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { ExerciseDto } from '../exercise.dto';
import { UUIDField } from '../../decorators';

export class CreateExerciseDto extends OmitType(ExerciseDto, [
  ...COMMON_ENTITY_FIELDS,
  'taskId',
  'task',
]) {
  @UUIDField()
  tenantId: string;
}
