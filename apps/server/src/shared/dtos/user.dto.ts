import { ApiProperty } from '@nestjs/swagger';
import {
  EmailField,
  PasswordField,
  PhoneField,
  StringField,
} from '../decorators';
import { AbstractDto } from './common';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../entities';
import { TenantDto } from './tenant.dto';
import { ProfileDto } from './profile.dto';

export class UserDto extends AbstractDto {
  constructor(user: UserEntity) {
    super(user);
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.password = user.password;
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

  @ApiProperty({
    type: () => [TenantDto],
  })
  tenants?: TenantDto[];

  @ApiProperty({
    type: () => [ProfileDto],
  })
  profiles?: ProfileDto[];
}
