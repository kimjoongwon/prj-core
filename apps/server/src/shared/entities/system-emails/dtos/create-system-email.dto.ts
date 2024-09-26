import { OmitType } from '@nestjs/swagger';
import { SystemEmailDto } from './system-email.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateSystemEmailDto extends OmitType(SystemEmailDto, [
  ...COMMON_ENTITY_FIELDS,
  'template',
  'email',
]) {}
