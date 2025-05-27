import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
} from '../decorator/field.decorators';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { AbstractDto } from './abstract.dto';
import { ProfileDto } from '.';
import { TenantDto } from './tenant.dto';
import { AssociationDto } from './association.dto';
import { ResponseExcludedField } from '../constant';

export class UserDto extends AbstractDto implements User {
  @UUIDField()
  spaceId: string;

  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @Exclude()
  @PasswordField({ description: ResponseExcludedField })
  password: string;

  @ClassField(() => ProfileDto, { each: true, required: false, swagger: false })
  profiles?: ProfileDto[];

  @ClassField(() => TenantDto, { each: true, required: false, swagger: false })
  tenants?: TenantDto[];

  @ClassField(() => AssociationDto, { each: true, required: false, swagger: false })
  associations?: AssociationDto[];
}
