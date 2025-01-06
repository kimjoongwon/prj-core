import { OmitType } from '@nestjs/swagger';
import { AssociationDto } from './association.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';
import { ClassField } from '../../../decorators';

export class CreateAssociationDto extends OmitType(AssociationDto, [
  ...COMMON_ENTITY_FIELDS,
  'group',
]) {}

export class CreateAssociationDtos {
  @ClassField(() => CreateAssociationDto, { each: true, isArray: true })
  items: CreateAssociationDto[];
}
