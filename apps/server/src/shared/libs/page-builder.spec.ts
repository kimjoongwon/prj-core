import { pageBuilder } from './page-builder';
import { OmitType } from '@nestjs/swagger';
import { ExerciseDto } from '../dtos/exercise.dto';
import { COMMON_ENTITY_FIELDS } from '../constants/entity-common-fields';
import { EnumField, StringField } from '../decorators/field.decorators';
import { $Enums } from '@prisma/client';
import { describe, it } from 'vitest';
import { CreateExerciseDto, defaultCreateExerciseDto } from '../dtos';

export class Test extends OmitType(ExerciseDto, [...COMMON_ENTITY_FIELDS, 'taskId']) {
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

  @StringField()
  contentAuthorId: string;

  @StringField()
  tenancyId: string;
}

describe('Test Class', () => {
  it('should create an instance of Test with provided values', () => {
    pageBuilder(CreateExerciseDto);
  });
});
