import { ApiProperty } from '@nestjs/swagger';
import { EmailField, PasswordField, PhoneField, StringField } from '../../../decorators';
import { Exclude } from 'class-transformer';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { TenantDto } from '../../tenants/dtos/tenant.dto';
import { TenancyDto } from '../../tenancies/dto/tenancy.dto';

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
  tenants?: TenancyDto[];

  @ApiProperty({
    type: () => [ProfileDto],
  })
  profiles?: ProfileDto[];
}
