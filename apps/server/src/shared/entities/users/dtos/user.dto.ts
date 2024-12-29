import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../../../decorators/field.decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants';
import { UserEntity } from '../user.entity';
import { Exclude } from 'class-transformer';
import { SpaceDto } from '../../spaces';

export class UserDto extends AbstractDto implements UserEntity {
  @UUIDField()
  spaceId: string;

  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @UUIDFieldOptional({ nullable: true, default: null })
  tenantId: string | null;

  @Exclude()
  @PasswordField()
  password: string;

  @StringField({ each: true, default: [] })
  assignmentIds: string[];

  @UUIDField({ nullable: true })
  classificationId: string | null;

  @ClassField(() => ProfileDto, { each: true, required: false })
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { each: true, required: false })
  tenants?: TenantDto[];

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
