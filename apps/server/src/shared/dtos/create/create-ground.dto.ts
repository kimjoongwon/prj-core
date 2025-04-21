import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { GroundDto } from '../ground.dto';

export class CreateGroundDto extends OmitType(GroundDto, [
  ...COMMON_ENTITY_FIELDS,
  'workspace',
  'imageDepot',
]) {}
