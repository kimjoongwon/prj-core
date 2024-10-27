import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants';
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
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { each: true, required: false })
  tenants?: TenantDto[];
}
