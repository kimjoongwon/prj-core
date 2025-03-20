import { OmitType } from '@nestjs/swagger';
import { UserDto } from '../user.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';

export class CreateUserDto extends OmitType(UserDto, [
  ...COMMON_ENTITY_FIELDS,
  'associations',
  'classification',
  'profiles',
  'tenants',
]) {}
