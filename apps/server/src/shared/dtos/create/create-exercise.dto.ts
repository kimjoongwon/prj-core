import { IntersectionType, OmitType } from '@nestjs/swagger';
import { EnumField, NumberField, StringField } from '../../decorators/field.decorators';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { ExerciseDto } from '../exercise.dto';
import { CreateTaskDto } from './create-task.dto';
import { CreateContentDto } from './create-content.dto';
import { $Enums } from '@prisma/client';

export const defaultCreateExerciseDto: CreateExerciseDto = {
  name: '',
  label: '',
  title: '',
  type: 'Textarea',
  description: '',
  text: '',
  duration: 0,
  count: 0,
  images: [],
  videos: [],
};

export class CreateDto extends OmitType(IntersectionType(CreateTaskDto, CreateContentDto), [
  'depotId',
  'tenantId',
]) {}

export class CreateExerciseDto
  extends OmitType(ExerciseDto, [...COMMON_ENTITY_FIELDS, 'taskId'])
  implements CreateDto
{
  @NumberField()
  duration: number;

  @NumberField()
  count: number;

  @StringField()
  name: string;

  @StringField()
  label: string;

  @StringField()
  title: string;

  @EnumField(() => $Enums.TextTypes)
  type: $Enums.TextTypes;

  @StringField()
  description: string;

  @StringField()
  text: string;

  @StringField()
  images: string[];

  @StringField()
  videos: string[];
}
