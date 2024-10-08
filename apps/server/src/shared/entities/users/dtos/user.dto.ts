import { ClassField, EmailField, PasswordField, StringField } from '../../../decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserEntity } from '../user.entity';
import { TenantDto } from '../../tenants';

export class UserDto extends AbstractDto implements UserEntity {
  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @PasswordField()
  password: string;

  @ClassField(() => ProfileDto, { each: true, nullable: true })
  profiles: ProfileDto[] | null;

  @ClassField(() => TenantDto, { each: true, nullable: true })
  tenants?: TenantDto[] | null;

  getActiveTenant(): TenantDto | null {
    return this.tenants?.find((tenant) => tenant.active) ?? null;
  }
}
