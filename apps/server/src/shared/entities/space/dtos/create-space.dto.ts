import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from './space.dto';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';

export class CreateSpaceDto extends OmitType(SpaceDto, [
  'groups',
  'tenancies',
  ...COMMON_ENTITY_FIELDS,
]) {}
