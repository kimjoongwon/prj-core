import { OmitType } from '@nestjs/swagger';
import { ClassificationDto } from './classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';
import { ClassField } from '../../../decorators';

export class CreateClassificationDto extends OmitType(ClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'space',
  'reservation',
  'user',
  'service',
  'category',
]) {}

export class CreateClassificationDtos {
  @ClassField(() => CreateClassificationDto, { each: true, isArray: true })
  items: CreateClassificationDto[];
}
