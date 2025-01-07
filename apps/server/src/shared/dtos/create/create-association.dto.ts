import { OmitType } from '@nestjs/swagger';
import { AssociationDto } from './association.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateAssociationDto extends OmitType(AssociationDto, [
  ...COMMON_ENTITY_FIELDS,
  'group',
  'user',
  'service',
]) {}
