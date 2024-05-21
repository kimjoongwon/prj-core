import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto, TenantDto, UserEntity } from '../modules';
import { AbstractDto } from './abstract.dto';
import {
  EmailField,
  PasswordField,
  PhoneField,
  StringField,
} from '../decorators';
import { Exclude, Type } from 'class-transformer';

export class UserDto extends AbstractDto implements UserEntity {
  constructor(user: UserEntity) {
    super(user);
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.password = user.password;
    this.tenants = user.tenants;
    this.profiles = user.profiles;
  }

  @EmailField()
  @Exclude()
  email: string;

  @StringField()
  name: string;

  @PhoneField()
  phone: string;

  @PasswordField()
  password: string;

  @Type(() => TenantDto)
  @ApiProperty({
    type: () => [TenantDto],
  })
  tenants?: TenantDto[];

  @Type(() => ProfileDto)
  @ApiProperty({
    type: () => [ProfileDto],
  })
  profiles?: ProfileDto[];
}
