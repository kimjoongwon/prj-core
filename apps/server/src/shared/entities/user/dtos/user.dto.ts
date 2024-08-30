import { ClassField, EmailField, PasswordField, StringField } from '../../../decorators';
import { Exclude } from 'class-transformer';
import { ProfileDto } from '../../profile/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { TenantDto } from '../../tenant';
import { User } from '@prisma/client';

export class UserDto extends AbstractDto implements UserEntity {
  constructor(user: User) {
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

  @ClassField(() => ProfileDto, { isArray: true, each: true, nullable: true })
  profiles: ProfileDto[] | null;

  @ClassField(() => TenantDto, { isArray: true, each: true, nullable: true, swagger: false })
  tenants: TenantDto[] | null;
}
