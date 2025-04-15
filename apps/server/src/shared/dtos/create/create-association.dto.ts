import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { AssociationDto } from '../association.dto';

export class CreateAssociationDto extends OmitType(AssociationDto, [
  ...COMMON_ENTITY_FIELDS,
  'group',
  'user',
  'service',
  'timeline',
  'content',
  'file',
  'task',
]) {}
