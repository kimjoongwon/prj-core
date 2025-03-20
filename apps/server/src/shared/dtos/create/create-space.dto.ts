import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from '../space.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';

export class CreateSpaceDto extends OmitType(SpaceDto, [
  ...COMMON_ENTITY_FIELDS,
  'associations',
  'classification',
  'tenant',
]) {}
