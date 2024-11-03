import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants';
import { UserEntity } from '../user.entity';
import { Exclude } from 'class-transformer';

export class UserDto extends AbstractDto implements UserEntity {
  @UUIDField()
  assignmentIds: string[];

  @UUIDField()
  classificationId: string;

  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @Exclude()
  @PasswordField()
  password: string;

  @ClassField(() => ProfileDto, { each: true, required: false })
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { each: true, required: false })
  tenants?: TenantDto[];
}
