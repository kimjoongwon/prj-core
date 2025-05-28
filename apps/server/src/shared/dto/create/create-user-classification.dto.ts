import { OmitType } from '@nestjs/swagger';
import { UserClassificationDto } from '../user-classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateUserClassificationDto extends OmitType(UserClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'user',
]) {}
