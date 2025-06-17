import { $Enums, Group } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  ClassField,
  EnumField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../decorator/field.decorators';
import { TenantDto } from './tenant.dto';

export class GroupDto extends AbstractDto implements Group {
  @StringField()
  name: string;

  @StringFieldOptional({ nullable: true })
  label: string | null;

  @EnumField(() => $Enums.GroupTypes, { required: true })
  type: $Enums.GroupTypes;

  @UUIDField()
  tenantId: string;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
