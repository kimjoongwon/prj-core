import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../decorators/field.decorators';
import { ProfileDto } from '../../profiles/profile.dto';
import { AbstractDto } from '../entities/common/dtos/abstract.dto';
import { TenantDto } from '../entities/tenants';
import { Exclude } from 'class-transformer';
import { SpaceDto } from '../entities/spaces';
import { User } from '@prisma/client';

export class UserDto extends AbstractDto implements User {
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

  @ClassField(() => ProfileDto, { each: true, required: false })
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { each: true, required: false })
  tenants?: TenantDto[];

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
