import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from './space.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateSpaceDto extends OmitType(SpaceDto, [
  'groups',
  'tenancies',
  ...COMMON_ENTITY_FIELDS,
]) {}
