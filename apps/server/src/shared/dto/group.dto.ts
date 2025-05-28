import { Group } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import {
  ClassField,
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

  @UUIDField()
  tenantId: string;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
