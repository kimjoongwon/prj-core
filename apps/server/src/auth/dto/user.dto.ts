import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto, TenantDto, UserEntity } from '../../shared/modules';
import {
  EmailField,
  PasswordField,
  PhoneField,
  StringField,
} from '../../shared/decorators';
import { AbstractDto } from '../../shared/dto';
import { Exclude } from 'class-transformer';

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
