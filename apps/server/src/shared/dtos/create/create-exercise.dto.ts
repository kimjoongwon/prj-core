import { OmitType } from '@nestjs/swagger';
import { EnumField, StringField, UUIDField } from '../../decorators/field.decorators';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { $Enums } from '@prisma/client';
import { ExerciseDto } from '../exercise.dto';

export class CreateExerciseDto extends OmitType(ExerciseDto, [...COMMON_ENTITY_FIELDS, 'taskId']) {
  @StringField()
  taskName: string;

  @StringField()
  taskLabel: string;

  @StringField()
  contentTitle: string;

  @StringField()
  contentDescription: string;

  @EnumField(() => $Enums.TextTypes)
  contentType: $Enums.TextTypes;

  @UUIDField()
  contentAuthorId: string;
}
