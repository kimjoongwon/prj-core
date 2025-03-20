import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../decorators/field.decorators';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { AbstractDto } from './abstract.dto';
import { ProfileDto } from './profile.dto';
import { TenantDto } from './tenant.dto';
import { AssociationDto } from './association.dto';
import { ClassificationDto } from './classification.dto';
import { Profile, Tenant } from '../entities';

export class UserDto extends AbstractDto implements User {
  @UUIDField()
  tenancyId: string;

  @UUIDField()
  spaceId: string;

  @EmailField()
  email: string;

  @StringField()
  name: string;

  @StringField()
  phone: string;

  @Exclude()
  @PasswordField()
  password: string;

  @ClassField(() => Profile, { each: true, required: false, swagger: false })
  profiles?: ProfileDto[];

  @ClassField(() => Tenant, { each: true, required: false, swagger: false })
  tenants?: TenantDto[];

  @ClassField(() => AssociationDto, { each: true, required: false, swagger: false })
  associations?: AssociationDto[];

  @ClassField(() => ClassificationDto, { required: false, swagger: false })
  classification?: ClassificationDto;
}
