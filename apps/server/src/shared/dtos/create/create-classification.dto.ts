import { OmitType } from '@nestjs/swagger';
import { ClassificationDto } from '../classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';

export class CreateClassificationDto extends OmitType(ClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'category',
  'space',
  'user',
  'timeline',
  'content',
  'task',
]) {}
