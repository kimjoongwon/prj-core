import { OmitType } from '@nestjs/swagger';
import { SpaceClassificationDto } from '../space-classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateSpaceClassificationDto extends OmitType(SpaceClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'category',
  'space',
]) {}
