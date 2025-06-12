import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from '../space.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateSpaceDto extends OmitType(SpaceDto, [
  ...COMMON_ENTITY_FIELDS,
  'tenants',
  'spaceClassifications',
  'spaceAssociations',
]) {}
