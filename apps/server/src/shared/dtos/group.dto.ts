import { Group } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { ServiceDto } from './service.dto';
import { AssociationDto } from './association.dto';
import { TenantDto } from './tenant.dto';

export class GroupDto extends AbstractDto implements Group {
  @StringField()
  name: string;

  @StringField()
  label: string;

  @StringField()
  serviceId: string;

  @UUIDField()
  tenantId: string;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;

  @ClassField(() => AssociationDto, { each: true, required: false })
  associations?: AssociationDto[];

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
