import { ClassField, EmailField, PasswordField, StringField } from '../../../decorators';
import { Exclude, Type } from 'class-transformer';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { TenantDto } from '../../tenants';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends AbstractDto implements UserEntity {
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

  @ClassField(() => TenantDto, { isArray: true, each: true, nullable: true })
  tenants?: TenantDto[] | null;

  getActiveTenant(): TenantDto | null {
    return this.tenants?.find((tenant) => tenant.active) ?? null;
  }
}
