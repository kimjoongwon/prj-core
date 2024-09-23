import { ClassField, EmailField, PasswordField, StringField } from '../../../decorators';
import { Exclude } from 'class-transformer';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { TenantDto } from '../../tenants';

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

  @ClassField(() => TenantDto, { isArray: true, each: true, nullable: true, swagger: false })
  tenants: TenantDto[] | null;

  getActiveTenant(): TenantDto | null {
    return this.tenants?.find((tenant) => tenant.active) ?? null;
  }
}
