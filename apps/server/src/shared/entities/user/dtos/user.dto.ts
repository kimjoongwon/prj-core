import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmailField, PasswordField, PhoneField, StringField } from '../../../decorators';
import { Exclude } from 'class-transformer';
import { ProfileDto } from '../../profile/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { ClassField } from 'src/shared/decorators/field.decorators';
import { TenantDto } from '../../tenant';

export class UserDto extends AbstractDto implements UserEntity {
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

  @StringField()
  phone: string;

  @PasswordField()
  password: string;

  @ApiPropertyOptional({
    type: () => [ProfileDto],
  })
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { isArray: true, each: true })
  tenants?: TenantDto[];
}
