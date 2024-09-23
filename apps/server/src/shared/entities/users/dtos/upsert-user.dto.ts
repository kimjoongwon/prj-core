import { OmitType } from '@nestjs/swagger';
import {
  EmailField,
  PhoneField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators';
import { UserDto } from './user.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class UpsertUserDto extends OmitType(UserDto, [
  ...COMMON_ENTITY_FIELDS,
  'profiles',
  'tenants',
]) {
  @EmailField()
  email: string;

  @StringField()
  name: string;

  @PhoneField()
  phone: string;

  @PasswordField()
  password: string;
}
