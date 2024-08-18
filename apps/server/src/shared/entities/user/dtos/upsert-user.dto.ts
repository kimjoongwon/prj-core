import { OmitType } from '@nestjs/swagger';
import {
  EmailField,
  PhoneField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators';
import { UserDto } from './user.dto';

export class UpsertUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
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
