import {
  ClassField,
  EmailField,
  PasswordField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../decorators/field.decorators';
import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ProfileDto } from './profile.dto';
import { TenantDto } from './tenant.dto';
import { SpaceDto } from './space.dto';
import { AssociationDto } from './association.dto';
import { ClassificationDto } from './classification.dto';

export class UserDto extends AbstractDto implements User {
  @UUIDField()
  tenancyId: string;

  @UUIDFieldOptional()
  classificationId: string | null;

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

  @ClassField(() => AssociationDto, { each: true, required: false })
  associations?: AssociationDto[];

  @ClassField(() => ClassificationDto, { required: false })
  classification?: ClassificationDto;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
