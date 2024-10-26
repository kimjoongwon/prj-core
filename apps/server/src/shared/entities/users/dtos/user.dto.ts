import { ClassField, EmailField, PasswordField, StringField } from '../../../decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants/dtos/tenant.dto';
import { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto implements UserEntity {
  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @PasswordField()
  password: string;

  @ClassField(() => ProfileDto, { each: true, required: false })
  profiles?: ProfileDto[] | null;

  @ClassField(() => TenantDto, { each: true, required: false })
  tenants?: TenantDto[] | null;

  getActiveTenant(): TenantDto | null {
    return this.tenants?.find((tenant) => tenant.active) ?? null;
  }
}
