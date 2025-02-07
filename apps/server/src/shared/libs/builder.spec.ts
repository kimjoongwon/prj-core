import { builder } from './builder';
import { OmitType } from '@nestjs/swagger';
import { ExerciseDto } from '../dtos/exercise.dto';
import { COMMON_ENTITY_FIELDS } from '../constants/entity-common-fields';
import { EnumField, StringField } from '../decorators/field.decorators';
import { $Enums } from '@prisma/client';
import { JSONSchema } from 'class-validator-jsonschema';
import { describe, it } from 'node:test';
// import { describe, it } from 'vitest';

export class Test extends OmitType(ExerciseDto, [...COMMON_ENTITY_FIELDS, 'taskId']) {
  @StringField({ default: ['test'] })
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Task name',
  })
  taskName: string;

  @StringField()
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Task label',
  })
  taskLabel: string;

  @StringField()
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Content title',
  })
  contentTitle: string;

  @StringField({
    each: true,
  })
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Content title',
  })
  contentDescription: string;

  @EnumField(() => $Enums.TextTypes)
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Content title',
  })
  contentType: $Enums.TextTypes;

  @StringField()
  @JSONSchema({
    type: 'string',
    format: 'input',

    description: 'Content title',
  })
  contentAuthorId: string;

  @StringField()
  @JSONSchema({
    type: 'string',
    format: 'input',
    description: 'Content title',
  })
  tenancyId: string;
}

describe('Test Class', () => {
  it('should create an instance of Test with provided values', () => {
    builder();
  });
});
